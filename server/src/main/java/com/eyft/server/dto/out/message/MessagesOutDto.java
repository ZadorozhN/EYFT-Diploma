package com.eyft.server.dto.out.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagesOutDto {
    private List<MessageOutDto> messages;
}
