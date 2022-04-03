package com.eyft.server.balance.kafka;

import com.eyft.server.balance.kafka.dto.BalanceDeltaDto;
import com.eyft.server.dto.out.balance.BalanceOutDto;
import com.eyft.server.model.Balance;
import com.eyft.server.model.mapper.BalanceMapper;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Slf4j
@RequiredArgsConstructor
public class KafkaBalanceListener {

    private final BalanceService balanceService;
    private final BalanceMapper balanceMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(topics = "balance", groupId = "balance_group_id")
    public void consume(BalanceDeltaDto balanceDeltaDto){
        log.info("Balance message has been received: " + balanceDeltaDto);

        balanceService.handleDelta(balanceDeltaDto.getAccountId(), balanceDeltaDto.getDelta());

        handleBalance(balanceDeltaDto.getAccountId());
    }

    private void handleBalance(String id) {

        Balance balance = balanceService.getByAccountId(id);

        Long userId = balance.getUser().getId();

        BalanceOutDto balanceOutDto = balanceMapper.fillBalanceOutDto(balance);

        String path = String.format("/topic/users/%d/balance", userId);

        simpMessagingTemplate.convertAndSend(path, balanceOutDto);
    }
}
