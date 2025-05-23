package com.tfg.back.configuration;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials().toString();

        com.tfg.back.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));



        // Verify password
        if (!passwordEncoder.matches(password, user.getHashedPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        switch (user.getStatus()) {
            case INACTIVE -> throw new DisabledException("Account is inactive");
            case SUSPENDED -> throw new LockedException("Account is suspended");
        }

        // Determine role
        String role = switch (user) {
            case Doctor d -> "ROLE_DOCTOR";
            case Client c -> "ROLE_CLIENT";
            default -> "ROLE_USER";
        };

        return new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                user.getHashedPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
