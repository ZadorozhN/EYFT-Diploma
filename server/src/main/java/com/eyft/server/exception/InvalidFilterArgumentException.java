package com.eyft.server.exception;

public class InvalidFilterArgumentException extends AbstractInternalApplicationException{
    public InvalidFilterArgumentException() {
        super("INVALID_FILTER_ARGUMENT");
    }
}

