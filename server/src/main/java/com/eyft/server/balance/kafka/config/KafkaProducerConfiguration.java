package com.eyft.server.balance.kafka.config;

import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.balance.kafka.dto.BalanceDeltaDto;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.Map;

@Configuration
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaProducerConfiguration {

    @Value("${spring.kafka.bootstrap.servers}")
    private String bootstrapServers;

    @Bean
    public KafkaTemplate<String, BalanceDeltaDto> createTemplate(KafkaProperties properties)
    {
        Map<String, Object> props = properties.buildProducerProperties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        return new KafkaTemplate<>(new DefaultKafkaProducerFactory<>(props));
    }
}
