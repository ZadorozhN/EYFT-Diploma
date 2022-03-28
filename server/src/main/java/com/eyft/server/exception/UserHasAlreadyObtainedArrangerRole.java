package com.eyft.server.exception;

public class UserHasAlreadyObtainedArrangerRole extends AbstractInternalApplicationException{
    public UserHasAlreadyObtainedArrangerRole() {
        super("USER_HAS_ALREADY_OBTAINED_ARRANGER_ROLE_OR_REQUEST_WAS_ALREADY_SENT");
    }
}
