package com.tfg.back.exceptions.user;

import com.tfg.back.enums.SearchType;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id, SearchType st) {
        super("Client not found with "+st+": "+ id);
    }
    public UserNotFoundException(String email, SearchType st) {
        super("Client not found with "+st+": "+ email);
    }


}
