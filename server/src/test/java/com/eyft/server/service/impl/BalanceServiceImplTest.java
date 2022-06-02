package com.eyft.server.service.impl;

import com.eyft.server.model.Balance;
import com.eyft.server.model.User;
import com.eyft.server.repository.BalanceRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceServiceImplTest {
    private static final long ID = 1L;
    private static final long CENTS = 100L;
    private static final String EXISTING_ACCOUNT_ID = "accountId";
    private static final String NOT_EXISTING_ACCOUNT_ID = "notExistingAccountId";

    @Mock
    private BalanceRepository balanceRepository;

    @InjectMocks
    private BalanceServiceImpl balanceService;

    @Test
    void save_NewBalance_ShouldSave(){
        Balance balance = Balance.newInstance();

        balanceService.save(balance);

        verify(balanceRepository, times(1)).save(balance);
    }

    @Test
    void save_Null_ShouldThrowException(){
        assertThrows(NullPointerException.class, () ->
                balanceService.save(null));
    }

    @Test
    void getById_ExistingBalanceId_ShouldGetBalance(){
        Balance expectedBalance = Balance.newInstance();
        expectedBalance.setId(ID);

        when(balanceRepository.findById(ID))
                .thenReturn(Optional.of(expectedBalance));

        Balance actualBalance = balanceService.getById(ID);

        assertEquals(expectedBalance, actualBalance);
    }

    @Test
    void getByUser_existingUser_shouldGetBalance() {
        Balance expectedBalance = Balance.newInstance();
        expectedBalance.setId(ID);
        User user = new User();

        when(balanceRepository.findByUser(user)).thenReturn(Optional.of(expectedBalance));

        Balance actualBalance = balanceService.getByUser(user);

        assertEquals(expectedBalance, actualBalance);
    }

    @Test
    void getByUser_nullUser_shouldThrowException() {
        assertThrows(NullPointerException.class, () -> balanceService.getByUser(null));
    }

    @Test
    void getByAccountId_existingAccountId_shouldGetBalance() {
        Balance expectedBalance = Balance.newInstance();
        expectedBalance.setId(ID);
        expectedBalance.setAccountId(EXISTING_ACCOUNT_ID);

        when(balanceRepository.findByAccountId(EXISTING_ACCOUNT_ID))
                .thenReturn(Optional.of(expectedBalance));

        Balance actualBalance = balanceService.getByAccountId(EXISTING_ACCOUNT_ID);

        assertEquals(expectedBalance, actualBalance);
    }

    @Test
    void getByAccountId_nullAccountId_ShouldThrowException() {
        assertThrows(NullPointerException.class, () -> balanceService.getByAccountId(null));
    }

    @Test
    void getById_NotExistingBalanceId_ShouldThrowException(){
        assertThrows(EntityNotFoundException.class, () -> balanceService.getById(ID));
    }

    @Test
    @Disabled
    void handleDelta_ExistingAccountId_ShouldHandleDelta(){
        Balance expectedBalance = Balance.newInstance();
        expectedBalance.setId(ID);
        expectedBalance.setCents(CENTS);

        when(balanceRepository.findByAccountId(EXISTING_ACCOUNT_ID)).thenReturn(Optional.of(expectedBalance));

        balanceService.handleDelta(EXISTING_ACCOUNT_ID, CENTS);

        verify(balanceRepository, times(1)).save(expectedBalance);
        assertEquals(expectedBalance.getCents(), CENTS + CENTS);
    }

    @Test
    void handleDelta_NotExistingAccountIdAndDelta_ShouldThrowException(){
        assertThrows(EntityNotFoundException.class, () -> balanceService.handleDelta(NOT_EXISTING_ACCOUNT_ID, CENTS));
    }

    @Test
    void handleDelta_NullAndDelta_ShouldThrowException(){
        assertThrows(NullPointerException.class, () -> balanceService.handleDelta(null, CENTS));
    }
}