package com.keystones.keystones.backend.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.keystones.keystones.backend.DTO.LoginRequestDTO;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Repository.User_Repository;

@Service
public class LoginService {

    private final User_Repository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public LoginService(User_Repository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(LoginRequestDTO loginRequest) {

        // Find user by email
        User user = userRepository
                .findByUserEmail(loginRequest.getUserEmail())
                .orElse(null);

        // Check if user exists
        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check password
        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
    
}