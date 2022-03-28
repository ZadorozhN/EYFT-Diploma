package com.eyft.server.dto.out.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceiversOutDto {
    private List<ReceiverOutDto> receivers;
}
