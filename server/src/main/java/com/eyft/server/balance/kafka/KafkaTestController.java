package com.eyft.server.balance.kafka;

import com.eyft.server.balance.kafka.condition.ConditionalOnKafkaBalance;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import com.eyft.server.service.BalanceService;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@ConditionalOnKafkaBalance
public class KafkaTestController {

    private final UserService userService;
    private final BalanceService balanceService;
    private final MoneyHandler moneyHandler;

    @GetMapping("/kafka-balance/{userId}/{cents}")
    public void addMoney(@PathVariable Long userId, @PathVariable Long cents){
        User user = userService.findById(userId).orElseThrow(UserDoesNotExistException::new);
        Balance balance = balanceService.getByUser(user);

        moneyHandler.handleRequest(balance.getAccountId(),cents);
    }
}
