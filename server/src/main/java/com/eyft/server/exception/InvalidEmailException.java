package com.eyft.server.exception;

public class InvalidEmailException extends AbstractInternalApplicationException{
    public InvalidEmailException() {
        super("INVALID_EMAIL");
    }
}

