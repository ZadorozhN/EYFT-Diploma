package com.eyft.server.balance.kafka;

import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.balance.kafka.dto.BalanceDeltaDto;
import com.eyft.server.service.MoneyHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaMoneyHandler implements MoneyHandler {

    private final KafkaTemplate<String, BalanceDeltaDto> kafkaTemplate;

    @Override
    public void handleRequest(String accountId, Long delta) {
        kafkaTemplate.send("balance", new BalanceDeltaDto(accountId, delta));
    }
}
