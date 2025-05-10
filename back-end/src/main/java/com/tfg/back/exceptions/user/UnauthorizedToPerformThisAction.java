package com.tfg.back.exceptions.user;

public class UnauthorizedToPerformThisAction extends RuntimeException {
    public UnauthorizedToPerformThisAction(String message) {
        super(message);
    }
}
