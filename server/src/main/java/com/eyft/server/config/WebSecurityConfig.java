package com.eyft.server.config;

import com.eyft.server.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf()
                    .disable()
                .headers()
                    .frameOptions()
                .disable()

                .and()
                .authorizeRequests()
                    .antMatchers("/me", "/users/**/joined", "/users/**/to-join").hasAnyRole("USER", "ARRANGER", "ADMIN")
                    .antMatchers("/arranger/**").hasAnyRole("ARRANGER", "ADMIN")
                    .antMatchers("/auth", "/registration").permitAll()
                    .antMatchers("/h2-console/**").permitAll()
                    .antMatchers("/kafka-balance/**").permitAll()
                    .antMatchers("/user-management/**",
                            "/event-management/**", "/category-management/**").hasRole("ADMIN")
                    .antMatchers("/resources/**").permitAll()
                    .antMatchers("/events").permitAll()
                    .antMatchers("/events/{eventId}").permitAll()
                    .antMatchers("/guest/**").permitAll()
                    .antMatchers("/events/{eventId}/comment/**").authenticated()
                    .antMatchers("/events/**").hasAnyRole("USER", "ARRANGER", "ADMIN")
                    .antMatchers(HttpMethod.GET, "/categories").permitAll()
                    .antMatchers("/categories/**").hasAnyRole("USER", "ARRANGER", "ADMIN")
                    .antMatchers("/ws/**").permitAll()
                    .antMatchers(HttpMethod.GET, "/comments/event/{id}").permitAll()
                    .antMatchers(HttpMethod.POST, "/comments/event/{id}").authenticated()
                .anyRequest()
                    .permitAll()
                .and()

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }


}

