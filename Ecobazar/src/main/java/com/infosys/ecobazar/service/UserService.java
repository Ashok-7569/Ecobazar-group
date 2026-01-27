package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // --- ADMIN FEATURES (Fixes the red errors) ---

    // 1. Get all users from the database
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Delete a user by ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    // ... existing code ...

    // 3. Get User by Email (For Profile Page)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}