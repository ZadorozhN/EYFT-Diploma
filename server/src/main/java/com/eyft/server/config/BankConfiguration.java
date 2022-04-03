package com.eyft.server.config;

import com.eyft.server.service.BankService;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.UserService;
import com.eyft.server.service.impl.BankServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(value = "bank.embedded.enabled", havingValue = "true")
public class BankConfiguration {

    private final MoneyHandler moneyHandler;
    private final UserService userService;

    @Bean
    public BankService bankService(){
        return new BankServiceImpl(moneyHandler, userService);
    }
}
