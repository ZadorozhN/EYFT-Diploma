package com.eyft.server.exception;

public class PhotoDoesNotExistException extends AbstractInternalApplicationException{
    public PhotoDoesNotExistException() {
        super("PHOTO_DOES_NOT_EXIST");
    }
}
