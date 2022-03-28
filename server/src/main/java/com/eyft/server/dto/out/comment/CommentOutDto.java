package com.eyft.server.dto.out.comment;

import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.user.UserOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentOutDto {
    private Long id;
    private String text;
    private EventOutDTO event;
    private UserOutDTO user;
    private Instant creationTime;
}
