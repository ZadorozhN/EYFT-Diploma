package com.eyft.server.filter;


import com.eyft.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,
                                    HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);

        if(token == null || !token.startsWith(JwtUtil.BEARER_PREFIX)){
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        token = jwtUtil.removeBearerPrefix(token);

        if(!jwtUtil.validateToken(token)){
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        String username = jwtUtil.getLogin(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails.getUsername(),
                userDetails.getPassword(),
                Optional.of(userDetails).map(UserDetails::getAuthorities).orElse(List.of())
        );

        WebAuthenticationDetails details = new WebAuthenticationDetails(httpServletRequest);
        authenticationToken.setDetails(details);

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}

