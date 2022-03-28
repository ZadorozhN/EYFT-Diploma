package com.eyft.server.controller;

import com.eyft.server.dto.in.user.UserAuthInDTO;
import com.eyft.server.dto.in.user.UserRegistrationInDTO;
import com.eyft.server.dto.out.AccessTokenOutDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.exception.InvalidEmailException;
import com.eyft.server.exception.UserHasBeenAlreadyRegisteredException;
import com.eyft.server.model.AccessToken;
import com.eyft.server.model.User;
import com.eyft.server.service.UserService;
import com.eyft.server.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    @PostMapping(value = "/registration", consumes = MediaType.APPLICATION_JSON_VALUE)
    public SuccessfulOutDTO registerUser(@RequestBody UserRegistrationInDTO userRegistrationInDTO) {

        User user = objectMapper.convertValue(userRegistrationInDTO, User.class);

        if (userService.findByLogin(user.getLogin()).isPresent()) {
            throw new UserHasBeenAlreadyRegisteredException();
        }

        userService.save(user);

        return new SuccessfulOutDTO("Registration is successful");
    }

    @PostMapping("/auth")
    public AccessTokenOutDTO auth(@RequestBody UserAuthInDTO userAuthInDTO) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userAuthInDTO.getLogin(),
                userAuthInDTO.getPassword()
        );

        authenticationManager.authenticate(authenticationToken);

        String login = userAuthInDTO.getLogin();

        User user = userService.findByLogin(login)
                .orElseThrow(() -> new BadCredentialsException("User hasn't been found"));

        AccessToken accessToken = jwtUtil.generateToken(user);

        return objectMapper.convertValue(accessToken, AccessTokenOutDTO.class);
    }

}
