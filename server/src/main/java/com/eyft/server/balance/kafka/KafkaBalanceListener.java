package com.eyft.server.balance.kafka;

import com.eyft.server.balance.kafka.dto.BalanceDto;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;

@Slf4j
@RequiredArgsConstructor
public class KafkaBalanceListener {

    private final BalanceService balanceService;

    @KafkaListener(topics = "balance", groupId = "balance_group_id")
    public void consume(BalanceDto balanceDto){
        log.info("Balance message has been received: " + balanceDto);

        balanceService.handleDelta(balanceDto.getAccountId(), balanceDto.getDelta());
    }
}
