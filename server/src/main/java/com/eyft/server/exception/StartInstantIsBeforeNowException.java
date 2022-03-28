package com.eyft.server.exception;

public class StartInstantIsBeforeNowException extends AbstractInternalApplicationException{
    public StartInstantIsBeforeNowException() {
        super("START_INSTANT_IS_BEFORE_NOW");
    }
}