package com.eyft.server.service.impl;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import com.eyft.server.repository.BalanceRepository;
import com.eyft.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private final BalanceRepository balanceRepository;

    @Override
    public Balance getById(long id) {

        return balanceRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public Balance getByUser(User user) {
        Objects.requireNonNull(user);

        return balanceRepository.findByUser(user)
                .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public Balance getByAccountId(String accountId) {
        Objects.requireNonNull(accountId);

        return balanceRepository.findByAccountId(accountId)
                .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public Balance save(Balance balance) {
        Objects.requireNonNull(balance);

        return balanceRepository.save(balance);
    }

    @Override
    @Transactional
    public Balance handleDelta(String accountId, long delta) {
        Objects.requireNonNull(accountId);

        Balance balance = getBalanceByAccountId(accountId);
        changeBalanceOnDelta(balance, delta);

        return balanceRepository.save(balance);
    }

    private Balance getBalanceByAccountId(String accountId){
        return balanceRepository
                .findByAccountId(accountId)
                .orElseThrow(EntityNotFoundException::new);
    }

    private void changeBalanceOnDelta(Balance balance, long delta) {
        long newCents = balance.getCents() + delta;
        log.info("Delta: {}; User: {}; Cents Before: {}; Cents After: {}", delta, balance.getUser().getLogin(),
                balance.getCents(), newCents);
        balance.setCents(newCents);
    }
}
