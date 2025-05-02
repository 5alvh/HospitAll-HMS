package com.tfg.back.exceptions.user;

import com.tfg.back.enums.SearchType;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id, SearchType st) {
        super(String.format("Client not found with "+st+": %d", id));
    }
    public UserNotFoundException(String email, SearchType st) {
        super(String.format("Client not found with "+st+": %d", email));
    }

}
