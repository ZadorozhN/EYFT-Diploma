package com.eyft.server.exception;

public class UserHasBeenAlreadyRegisteredException extends AbstractInternalApplicationException{
    public UserHasBeenAlreadyRegisteredException() {
        super("USER_HAS_BEEN_ALREADY_REGISTERED");
    }
}
