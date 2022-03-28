package com.eyft.server.balance.kafka.config;

import com.eyft.server.balance.kafka.KafkaBalanceListener;
import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.balance.kafka.dto.BalanceDto;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaBalanceConfiguration {

    private final BalanceService balanceService;

    @Bean
    public KafkaBalanceListener kafkaBalanceListener() {
        return new KafkaBalanceListener(balanceService);
    }
}
