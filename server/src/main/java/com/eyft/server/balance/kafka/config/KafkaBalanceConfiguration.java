package com.eyft.server.balance.kafka.config;

import com.eyft.server.balance.kafka.KafkaBalanceListener;
import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.model.mapper.BalanceMapper;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;


@Configuration
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaBalanceConfiguration {

    private final BalanceMapper balanceMapper;
    private final BalanceService balanceService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Bean
    public KafkaBalanceListener kafkaBalanceListener() {
        return new KafkaBalanceListener(balanceService, balanceMapper, simpMessagingTemplate);
    }
}
