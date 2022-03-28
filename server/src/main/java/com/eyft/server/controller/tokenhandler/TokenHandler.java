package com.eyft.server.controller.tokenhandler;

import com.eyft.server.exception.UnsupportedTokenException;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.User;
import com.eyft.server.service.UserService;
import com.eyft.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenHandler {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public User getUser(String token){
        token = handleToken(token);

        String login = jwtUtil.getLogin(token);

        return userService.findByLogin(login)
                .orElseThrow(UserDoesNotExistException::new);
    }

    public String handleToken(String token){
        if(jwtUtil.isBearer(token)) {
            return jwtUtil.removeBearerPrefix(token);
        } else {
            throw new UnsupportedTokenException();
        }
    }
}
