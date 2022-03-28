package com.eyft.server.dto.out.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceiverOutDto {
    private Long id;
    private String login;
    private Long avatarId;
}
