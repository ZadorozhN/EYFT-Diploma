package com.eyft.server.dto.out.message;

import com.eyft.server.dto.out.user.UserOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageOutDto {
    private Long id;
    private String text;
    private UserOutDTO sender;
    private UserOutDTO receiver;
    private Instant creationTime;
}
