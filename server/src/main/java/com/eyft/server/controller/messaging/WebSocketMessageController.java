package com.eyft.server.controller.messaging;

import com.eyft.server.dto.in.messaging.MessageInDto;
import com.eyft.server.dto.out.message.MessageOutDto;
import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.model.Message;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.MessageMapper;
import com.eyft.server.model.mapper.UserMapper;
import com.eyft.server.service.MessageService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketMessageController {

    private final UserService userService;
    private final MessageService messageService;
    private final MessageMapper messageMapper;

    @MessageMapping("/receivers/{id}")
    @SendTo("/topic/users/{id}")
    public MessageOutDto handleMessage(@DestinationVariable Long id, MessageInDto messageInDto, Authentication authentication) {
        log.info("Message from " + messageInDto + " " + authentication.getPrincipal());

        Optional<User> sender = userService.findByLogin(authentication.getName());
        Optional<User> receiver = userService.findById(id);

        if(sender.isEmpty()){
            throw new CustomInternalApplicationException("Sender does not exist");
        }

        if(receiver.isEmpty()){
            throw new CustomInternalApplicationException("Receiver does not exist");
        }

        log.info("Sender is "+ sender.get().getLogin());
        log.info("Receiver is "+ receiver.get().getLogin());

        Message message = new Message(messageInDto.getText(), sender.get(), receiver.get(), Instant.now());

        message = messageService.save(message);

        return messageMapper.fillMessageOutDto(message);
    }
}
