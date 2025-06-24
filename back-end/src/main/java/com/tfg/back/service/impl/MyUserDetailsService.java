package com.tfg.back.service.impl;

import com.tfg.back.model.User;
import com.tfg.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    //By email, for the login
    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return user;
    }

    public User loadUserByUsername(UUID uuid) throws UsernameNotFoundException {
        User user = userRepository.findById(uuid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return user;
    }
}
