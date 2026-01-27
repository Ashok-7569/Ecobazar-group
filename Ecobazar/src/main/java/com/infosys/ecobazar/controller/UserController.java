package com.infosys.ecobazar.controller;

import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/users") // CHANGED from "/auth" to "/users"
public class UserController {

    @Autowired
    private UserService userService;

    // 1. Get All Users (For Admin Dashboard)
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 2. Delete/Ban User (For Admin Dashboard)
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User Banned/Deleted Successfully";
    }
    // ... existing code ...

    // 3. Get MY Profile (For Any Logged-in User)
    @GetMapping("/profile")
    public User getMyProfile(Principal principal) {
        // Principal automatically holds the email of the person who sent the token
        String email = principal.getName();
        return userService.getUserByEmail(email);
    }
}