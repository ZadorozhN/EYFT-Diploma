package com.eyft.server.exception;

public class EventDoesNotExistException extends AbstractInternalApplicationException{
    public EventDoesNotExistException() {
        super("EVENT_DOES_NOT_EXIST_EXCEPTION");
    }
}