package com.eyft.server.controller.support;

import com.eyft.server.dto.in.support.SupportInDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.User;
import com.eyft.server.service.MailService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/support")
public class SupportController {

    private final UserService userService;
    private final MailService mailService;

    @PostMapping
    public SuccessfulOutDTO support(@RequestBody SupportInDto supportInDto){
        if(supportInDto.getType().equals("FORGOTTEN_PASSWORD")){
            processForgottenPasswordRequest(supportInDto);
        }

        return new SuccessfulOutDTO("Request received");
    }


    private void processForgottenPasswordRequest(SupportInDto supportInDto){
        User user = userService.findByLogin(supportInDto.getLogin()).orElseThrow(UserDoesNotExistException::new);

        String password = userService.recoverPassword(user);

        mailService.sendEmail(user, "Password changed", "Your new password is " + password);
    }
}
