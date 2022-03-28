package com.eyft.server.exception;

public class EventHasBeenFinishedException extends AbstractInternalApplicationException{
    public EventHasBeenFinishedException() {
        super("EVENT_HAS_BEEN_FINISHED");
    }
}

