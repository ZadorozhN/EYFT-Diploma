package com.eyft.server.exception;

public class DifferentPasswordsException extends AbstractInternalApplicationException{
    public DifferentPasswordsException() {
        super("DIFFERENT_PASSWORDS");
    }
}
