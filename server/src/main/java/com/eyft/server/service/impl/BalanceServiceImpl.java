package com.eyft.server.service.impl;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import com.eyft.server.repository.BalanceRepository;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private final BalanceRepository balanceRepository;

    @Override
    public Balance getById(long id) {
        return balanceRepository.getById(id);
    }

    @Override
    public Balance getByUser(User user) {
        return balanceRepository.getByUser(user);
    }

    @Override
    public Balance getByAccountId(String accountId) {
        return balanceRepository.getByAccountId(accountId);
    }

    @Override
    public Balance save(Balance balance) {
        Objects.requireNonNull(balance);

        return balanceRepository.save(balance);
    }

    @Override
    @Transactional
    public Balance handleDelta(String accountId, Long delta) {
        Balance balance = balanceRepository.getByAccountId(accountId);

        long newBalance = balance.getCents() + delta;
        balance.setCents(newBalance);

        return balanceRepository.save(balance);
    }
}
