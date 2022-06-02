package com.eyft.server.repository;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BalanceRepository extends JpaRepository<Balance, Long> {

    Optional<Balance> findByUser(User user);

    Optional<Balance> findByAccountId(String accountId);
}
