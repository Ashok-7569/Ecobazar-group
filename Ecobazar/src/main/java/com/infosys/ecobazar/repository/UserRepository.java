package com.infosys.ecobazar.repository;

import com.infosys.ecobazar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // We need this custom method to find a user by email during Login
    Optional<User> findByEmail(String email);
}