package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.UserRepository;
import com.infosys.ecobazar.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // The BCrypt Scrambler

    @Autowired
    private AuthenticationManager authenticationManager; // The Login Checker

    @Autowired
    private JwtUtil jwtUtil;

    // 1. REGISTER Logic (Encrypts Password)
    public User registerUser(User user) {
        // Scramble the password before saving!
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 2. LOGIN Logic (Checks Password & Generates Token)
    public Map<String, String> login(String email, String password) {
        // This automatically checks if the scrambled password matches
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        // If we get here, the password was correct!
        // Fetch user to get their role
        User user = userRepository.findByEmail(email).orElseThrow();

        // Generate Token
        String token = jwtUtil.generateToken(user.getEmail());

        // Return Token + Role
        Map<String, String> response = new HashMap<>();

        // Ensure "token" key is NOT null
        if(token != null) {
            response.put("token", token);
            response.put("role", user.getRole().toString());
            response.put("message", "Login Successful");
        } else {
            throw new RuntimeException("Token generation failed");
        }

        return response;
    }
}