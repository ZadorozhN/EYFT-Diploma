package com.eyft.server.service.impl;

import com.eyft.server.model.Balance;
import com.eyft.server.repository.BalanceRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceServiceImplTest {

    @Mock
    private BalanceRepository balanceRepository;

    @InjectMocks
    private BalanceServiceImpl balanceService;

    @Test
    void save_NewBalance_ShouldSave(){
        Balance balance = Balance.newInstance();

        balanceService.save(balance);

        verify(balanceRepository, only()).save(balance);
    }

    @Test
    void save_Null_ShouldThrowException(){
        assertThrows(NullPointerException.class, () ->
                balanceService.save(null)
        );
    }

    @Test
    void getById_ExistingBalanceId_ShouldGetBalance(){
        Balance expectedBalance = Balance.newInstance();
        expectedBalance.setId(1L);

        when(balanceRepository.getById(1L)).thenReturn(expectedBalance);

        Balance actualBalance = balanceService.getById(1L);

        verify(balanceRepository, only()).getById(1L);
        assertEquals(expectedBalance, actualBalance);
    }

    @Test
    void getById_NotExistingBalanceId_ShouldThrowException(){
        when(balanceRepository.getById(1L)).thenThrow(new EntityNotFoundException());

        assertThrows(EntityNotFoundException.class, () -> balanceService.getById(1L));

        verify(balanceRepository, only()).getById(1L);
    }

    @Test
    void handleDelta_ExistingAccountId_ShouldHandleDelta(){
        balanceService.handleDelta("accountId", 1000L);
    }

    @Test
    void handleDelta_NotExistingAccountIdAndDelta_ShouldThrowException(){
        balanceService.handleDelta("notExistingAccountId", 1000L);
    }

    @Test
    void handleDelta_NullAndDelta_ShouldThrowException(){
        balanceService.handleDelta(null, 1000L);
    }
}