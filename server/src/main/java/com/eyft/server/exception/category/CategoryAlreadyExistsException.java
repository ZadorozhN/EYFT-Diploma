package com.eyft.server.exception.category;

import com.eyft.server.exception.AbstractInternalApplicationException;

public class CategoryAlreadyExistsException extends AbstractInternalApplicationException {
    public CategoryAlreadyExistsException() {
        super("CATEGORY_ALREADY_EXISTS");
    }
}