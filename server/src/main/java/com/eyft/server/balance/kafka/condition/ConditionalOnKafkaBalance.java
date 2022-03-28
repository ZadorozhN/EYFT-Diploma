package com.eyft.server.balance.kafka.condition;

import org.springframework.context.annotation.Conditional;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Conditional(OnKafkaBalanceCondition.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionalOnKafkaBalance {
}
