package com.tfg.back.controller;

import com.tfg.back.model.dtos.password.ForgotPasswordRequest;
import com.tfg.back.model.dtos.password.ResetPasswordRequest;
import com.tfg.back.service.impl.PasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class PasswordController {

    private final PasswordService accountService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        accountService.initiatePasswordReset(req.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        if (!req.newPassword().equals(req.confirmPassword()))
            throw new IllegalArgumentException("Passwords do not match");

        accountService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.noContent().build();
    }
}

