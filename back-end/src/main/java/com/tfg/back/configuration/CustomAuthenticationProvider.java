package com.tfg.back.configuration;

import com.tfg.back.constants.Roles;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.User;
import com.tfg.back.repository.UserRepository;
import com.tfg.back.service.impl.MyUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
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
    private MyUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials().toString();

        //I should use loadUserByUsername instead
        User user = userDetailsService.loadUserByUsername(email);

        if (!passwordEncoder.matches(password, user.getHashedPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        switch (user.getStatus()) {
            case INACTIVE -> throw new DisabledException("Account is inactive");
            case SUSPENDED -> throw new LockedException("Account is suspended");
        }

        String role = switch (user) {
            case Doctor d -> Roles.DOCTOR;
            case Client c -> Roles.CLIENT;
            default -> "ROLE_USER";
        };

        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }


}
