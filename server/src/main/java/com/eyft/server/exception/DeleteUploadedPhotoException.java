package com.eyft.server.exception;

public class DeleteUploadedPhotoException extends AbstractInternalApplicationException{
    public DeleteUploadedPhotoException() {
        super("DELETE_UPLOADED_PHOTO_EXCEPTION");
    }
}