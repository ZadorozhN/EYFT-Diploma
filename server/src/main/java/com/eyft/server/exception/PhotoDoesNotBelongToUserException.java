package com.eyft.server.exception;

public class PhotoDoesNotBelongToUserException extends AbstractInternalApplicationException{
    public PhotoDoesNotBelongToUserException() {
        super("PHOTO_DOES_NOT_BELONG_TO_USER");
    }
}

