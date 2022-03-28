package com.eyft.server.exception;

public class UserDoesNotExistException extends AbstractInternalApplicationException{
    public UserDoesNotExistException() {
        super("USER_DOES_NOT_EXIST_EXCEPTION");
    }
}