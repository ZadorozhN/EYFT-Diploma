package com.eyft.server.exception;

public class CustomInternalApplicationException extends AbstractInternalApplicationException{
    public CustomInternalApplicationException(String code) {
        super(code);
    }
}