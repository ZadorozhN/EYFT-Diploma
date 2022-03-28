package com.eyft.server.exception.validation;

import com.eyft.server.exception.AbstractInternalApplicationException;

public class CommonValidationException extends AbstractInternalApplicationException {

    public CommonValidationException(ValidationError validationError) {
        super(validationError.name());
    }

    public static enum ValidationError{
        INVALID_FIRST_NAME,
        INVALID_LAST_NAME,
        INVALID_EMAIL,
        INVALID_PASSWORD,
        INVALID_LOGIN;
    }
}
