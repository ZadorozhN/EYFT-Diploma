package com.eyft.server.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AbstractInternalApplicationException extends RuntimeException {
    private final String code;

    public AbstractInternalApplicationException(Exception exception, String code){
        super(exception);
        this.code = code;
    }
}

