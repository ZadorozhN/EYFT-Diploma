package com.eyft.server.service;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;

public interface BalanceService {

    Balance getById(long id);

    Balance getByUser(User user);

    Balance getByAccountId(String accountId);

    Balance save(Balance balance);

    Balance handleDelta(String accountId, long delta);
}
