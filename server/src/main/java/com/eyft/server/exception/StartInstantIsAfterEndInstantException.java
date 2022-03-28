package com.eyft.server.exception;

public class StartInstantIsAfterEndInstantException extends AbstractInternalApplicationException{
    public StartInstantIsAfterEndInstantException() {
        super("START_INSTANT_IS_BEFORE_END_INSTANT");
    }
}
