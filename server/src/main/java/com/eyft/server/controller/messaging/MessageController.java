package com.eyft.server.controller.messaging;

import com.eyft.server.dto.in.messaging.MessageInDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.message.MessageOutDto;
import com.eyft.server.dto.out.message.MessagesOutDto;
import com.eyft.server.dto.out.message.ReceiverOutDto;
import com.eyft.server.dto.out.message.ReceiversOutDto;
import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.model.Message;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.MessageMapper;
import com.eyft.server.model.mapper.UserMapper;
import com.eyft.server.service.MessageService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/message")
public class MessageController {

    private final UserMapper userMapper;
    private final UserService userService;
    private final MessageMapper messageMapper;
    private final MessageService messageService;

    @GetMapping
    public MessagesOutDto getMyMessages(Authentication authentication){
        Optional<User> user = userService.findByLogin(authentication.getName());

        if(user.isEmpty()){
            throw new CustomInternalApplicationException("User does not exist");
        }

        List<Message> messages = messageService.getAllByUser(user.get());
        List<MessageOutDto> messagesOutDtos = messages.stream()
                .map(messageMapper::fillMessageOutDto)
                .collect(Collectors.toList());

        return new MessagesOutDto(messagesOutDtos);
    }

    @GetMapping("/receivers")
    public ReceiversOutDto getReceivers(){
        List<User> users = userService.findAll();

        List<ReceiverOutDto> receiverOutDtos = users.stream()
                .map(userMapper::fillReceiverOutDto)
                .collect(Collectors.toList());

        return new ReceiversOutDto(receiverOutDtos);
    }

    @PostMapping("/user/{receiverId}")
    public SuccessfulOutDTO sendMessage(@PathVariable Long receiverId, @RequestBody MessageInDto messageInDto, Authentication authentication){
        Optional<User> sender = userService.findByLogin(authentication.getName());
        Optional<User> receiver = userService.findById(receiverId);

        if(sender.isEmpty()){
            throw new CustomInternalApplicationException("Sender does not exist");
        }

        if(receiver.isEmpty()){
            throw new CustomInternalApplicationException("Receiver does not exist");
        }

        messageService.save(receiver.get(), sender.get(), messageInDto.getText());

        return new SuccessfulOutDTO("Message was sent");
    }

    @GetMapping("/user/{receiverId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long receiverId, Authentication authentication){
        Optional<User> sender = userService.findByLogin(authentication.getName());
        Optional<User> receiver = userService.findById(receiverId);

        if(sender.isEmpty()){
            throw new CustomInternalApplicationException("Sender does not exist");
        }

        if(receiver.isEmpty()){
            throw new CustomInternalApplicationException("Receiver does not exist");
        }
        

        return ResponseEntity.ok(messageService.getAllBySenderAndReceiver(sender.get(), receiver.get()));
    }
}
