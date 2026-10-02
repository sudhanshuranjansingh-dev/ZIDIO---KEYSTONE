package com.keystones.keystones.backend.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Repository.User_Repository;

@Service
public class PasswordResetService {

    private final User_Repository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public PasswordResetService(
            User_Repository userRepository) {

        this.userRepository = userRepository;
    }

    // =========================
    // CREATE RESET TOKEN
    // =========================

    public String createResetToken(String email) {

        User user = userRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email."
                        ));

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);

        // Token valid for 15 minutes
        user.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(15)
        );

        userRepository.save(user);

        return token;
    }


    // =========================
    // RESET PASSWORD
    // =========================

    public void resetPassword(
            String token,
            String newPassword) {

        User user = userRepository
                .findByResetToken(token)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid or expired reset token."
                        ));

        // Check token expiry
        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Invalid or expired reset token."
            );
        }

        // Encrypt new password
        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        // Invalidate token after successful reset
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}