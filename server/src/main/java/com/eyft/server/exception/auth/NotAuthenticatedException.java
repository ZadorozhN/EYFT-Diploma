package com.eyft.server.exception.auth;

import com.eyft.server.exception.AbstractInternalApplicationException;

public class NotAuthenticatedException extends AbstractInternalApplicationException {
    public NotAuthenticatedException() {
        super("NOT_AUTHENTICATED");
    }
}
