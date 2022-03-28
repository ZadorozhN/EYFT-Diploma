package com.eyft.server.exception;

public class IllegalEventStateChangeException extends AbstractInternalApplicationException{
    public IllegalEventStateChangeException() {
        super("ILLEGAL_EVENT_STATE_CHANGE");
    }
}

