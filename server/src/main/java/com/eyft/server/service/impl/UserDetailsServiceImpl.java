package com.eyft.server.service.impl;

import com.eyft.server.model.User;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static org.springframework.security.core.userdetails.User.builder;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("user hasn't been found"));

        List<SimpleGrantedAuthority> authorityList = buildAuthorityList(user);

        return builder()
                .username(user.getLogin())
                .password(user.getPassword())
                .credentialsExpired(false)
                .accountExpired(false)
                .accountLocked(false)
                .disabled(!user.isEnabled())
                .authorities(authorityList)
                .build();
    }

    private List<SimpleGrantedAuthority> buildAuthorityList(User user){
        String rolePrefix = "ROLE_";
        String role = rolePrefix + user.getRole().name();

        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }
}

