package com.tfg.back.model.dtos.auth;


public record AuthRequest (
    String email,
     String password,
    boolean rememberMe
){}
