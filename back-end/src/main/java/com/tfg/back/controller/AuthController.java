package com.tfg.back.controller;

import com.tfg.back.constants.BaseRoutes;
import com.tfg.back.model.dtos.auth.AuthRequest;
import com.tfg.back.service.impl.LoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseRoutes.AUTHENTICATION)
public class AuthController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {
        return loginService.login(request);
    }
}
