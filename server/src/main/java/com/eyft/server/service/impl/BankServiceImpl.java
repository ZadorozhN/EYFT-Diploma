package com.eyft.server.service.impl;

import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import com.eyft.server.service.BankService;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
public class BankServiceImpl implements BankService {

    private final MoneyHandler moneyHandler;
    private final UserService userService;

    @Override
    @Transactional
    public void withdraw(String login, long cents) {
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        Balance balance = user.getBalance();

        if(cents > balance.getCents()){
            throw new CustomInternalApplicationException("Not enough amount of money");
        }

        String accountId = balance.getAccountId();

        moneyHandler.handleRequest(accountId, -cents);
    }

    @Override
    @Transactional
    public void deposit(String login, long cents) {
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        String accountId = user.getBalance().getAccountId();

        moneyHandler.handleRequest(accountId, cents);
    }
}
