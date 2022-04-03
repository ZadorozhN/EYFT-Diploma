package com.eyft.server.balance.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BalanceDeltaDto {
    private String accountId;
    private Long delta;
}
