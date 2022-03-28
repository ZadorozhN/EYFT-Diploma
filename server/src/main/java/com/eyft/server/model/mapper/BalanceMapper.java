package com.eyft.server.model.mapper;

import com.eyft.server.dto.out.balance.BalanceOutDto;
import com.eyft.server.model.Balance;
import org.springframework.stereotype.Component;

@Component
public class BalanceMapper {
    public BalanceOutDto fillBalanceOutDto(Balance balance){
        return new BalanceOutDto(
                balance.getAccountId(),
                balance.getCents());
    }
}
