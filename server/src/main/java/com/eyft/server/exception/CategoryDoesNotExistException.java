package com.eyft.server.exception;

public class CategoryDoesNotExistException extends AbstractInternalApplicationException{
    public CategoryDoesNotExistException() {
        super("CATEGORY_DOES_NOT_EXIST_EXCEPTION");
    }
}