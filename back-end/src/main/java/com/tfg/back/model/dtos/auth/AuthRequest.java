package com.tfg.back.model.dtos.auth;


import java.util.UUID;

public record AuthRequest (
        String email,
     String password,
    boolean rememberMe
){}
