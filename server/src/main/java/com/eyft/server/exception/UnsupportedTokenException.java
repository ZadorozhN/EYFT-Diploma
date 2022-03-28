package com.eyft.server.exception;

public class UnsupportedTokenException extends AbstractInternalApplicationException{
    public UnsupportedTokenException() {
        super("UNSUPPORTED_TOKEN");
    }
}
