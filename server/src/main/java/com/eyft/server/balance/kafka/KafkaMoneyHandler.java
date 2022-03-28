package com.eyft.server.balance.kafka;

import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.balance.kafka.dto.BalanceDto;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaMoneyHandler implements MoneyHandler {

    private final UserService userService;
    private final KafkaTemplate<String, BalanceDto> kafkaTemplate;

    @Override
    public void handleRequest(String accountId, Long delta) {
        kafkaTemplate.send("balance", new BalanceDto(accountId, delta));
    }
}
