package com.eyft.server.exception;

public class PhotoDoesNotBelongToEventException extends AbstractInternalApplicationException{
    public PhotoDoesNotBelongToEventException() {
        super("PHOTO_DOES_NOT_BELONG_TO_EVENT");
    }
}
