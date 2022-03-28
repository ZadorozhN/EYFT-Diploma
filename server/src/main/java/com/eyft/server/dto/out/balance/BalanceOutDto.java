package com.eyft.server.dto.out.balance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceOutDto {
    private String accountId;
    private Long cents;
}
