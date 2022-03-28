package com.eyft.server.repository;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BalanceRepository extends JpaRepository<Balance, Long> {
    //What if user has no balance?
    Balance getByUser(User user);

    Balance getByAccountId(String accountId);
}
