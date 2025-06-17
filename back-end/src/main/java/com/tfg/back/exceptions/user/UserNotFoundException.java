package com.tfg.back.exceptions.user;

import com.tfg.back.enums.SearchType;

import java.util.UUID;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(UUID id, SearchType st) {
        super("User not found with "+st+": "+ id);
    }
    public UserNotFoundException(String email, SearchType st) {
        super("User not found with "+st+": "+ email);
    }

}
