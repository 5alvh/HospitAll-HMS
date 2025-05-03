package com.tfg.back.exceptions.user;


/*
TO IMPLEMENT 03/05/203
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
