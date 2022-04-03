package com.eyft.server.service.impl;

import com.eyft.server.repository.UserRepository;
import com.eyft.server.service.MoneyHandler;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.mockito.Mockito.*;

class UserServiceImplTest {
    private final BCryptPasswordEncoder bCryptPasswordEncoder = mock(BCryptPasswordEncoder.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final MoneyHandler moneyHandler = mock(MoneyHandler.class);

    private final UserServiceImpl userService = new UserServiceImpl(bCryptPasswordEncoder, userRepository, moneyHandler);

    @Test
    void deleteById() {
        long someId = 5;

        userService.deleteById(someId);

        verify(userRepository, times(1)).deleteById(someId);
    }

    @Test
    void findById(){
        long someUserId = 5;

        userService.findById(someUserId);

        verify(userRepository, only()).findById(someUserId);
    }

    @Test
    void findAll(){
        userService.findAll();

        verify(userRepository, only()).findAll();
    }
}