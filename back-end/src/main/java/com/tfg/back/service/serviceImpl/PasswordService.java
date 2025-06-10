package com.tfg.back.service.serviceImpl;

import com.tfg.back.model.User;
import com.tfg.back.repository.UserRepository;
import com.tfg.back.utils.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping
@RestController
@AllArgsConstructor
public class PasswordService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    /* Step 1: “Forgot my password” */
    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user with e-mail " + email));

        String token = jwtUtil.generatePasswordResetToken(user.getEmail());
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    /* Step 2: “Choose a new password” */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (!jwtUtil.isPasswordResetToken(token))
            throw new IllegalArgumentException("Invalid reset token");

        String email = jwtUtil.extractUsername(token);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user with e-mail " + email));

        user.setHashedPassword(passwordEncoder.encode(newPassword));
        // Optional: invalidate the token by storing its JTI in a blacklist/used-token table
    }
}
