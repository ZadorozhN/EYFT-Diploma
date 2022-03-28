package com.eyft.server.model.mapper;

import com.eyft.server.dto.out.message.MessageOutDto;
import com.eyft.server.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final UserMapper userMapper;

    public MessageOutDto fillMessageOutDto(Message message){
        return new MessageOutDto(message.getId(),
                message.getText(),
                userMapper.fillUserOutDTO(message.getSender()),
                userMapper.fillUserOutDTO(message.getReceiver()),
                message.getCreationTime());
    }
}
