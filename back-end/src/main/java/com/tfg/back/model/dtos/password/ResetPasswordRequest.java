package com.tfg.back.model.dtos.password;

public record ResetPasswordRequest(String token, String newPassword, String confirmPassword) {
}
