package com.eyft.server.controller.controlleradvice;

import com.eyft.server.dto.out.ErrorOutDTO;
import com.eyft.server.exception.AbstractInternalApplicationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorOutDTO handleInternalApplicationExceptionException(AbstractInternalApplicationException e){
        ErrorOutDTO errorDTO = new ErrorOutDTO();
        errorDTO.setCode(e.getCode());

        return errorDTO;
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorOutDTO handleBadCredentialsException(BadCredentialsException e){
        ErrorOutDTO errorDTO = new ErrorOutDTO();
        errorDTO.setCode("FAILED_LOGIN");

        return errorDTO;
    }
}

