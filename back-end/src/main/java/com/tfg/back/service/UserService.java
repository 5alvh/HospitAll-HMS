package com.tfg.back.service;

import com.tfg.back.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService<T extends User> {
    T save(T user);
    Optional<T> findById(Long id);
    List<T> findAll();
    void deleteById(Long id);
}
