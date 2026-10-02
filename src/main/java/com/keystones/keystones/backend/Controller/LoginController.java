package com.keystones.keystones.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.keystones.keystones.backend.DTO.LoginRequestDTO;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Security.JwtService;
import com.keystones.keystones.backend.Service.LoginService;
import com.keystones.keystones.backend.Service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public LoginController(
            LoginService loginService,
            JwtService jwtService,
            PasswordResetService passwordResetService) {

        this.loginService = loginService;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO loginRequest) {

        User user = loginService.login(loginRequest);

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getUserEmail(),
                        user.getRole()
                )
        );
    }


    // =========================
    // FORGOT PASSWORD
    // =========================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        String token =
                passwordResetService.createResetToken(
                        request.getUserEmail()
                );

        return ResponseEntity.ok(
                new ForgotPasswordResponse(
                        "Password reset token generated successfully.",
                        token
                )
        );
    }


    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                "Password reset successfully!"
        );
    }


    // =========================
    // LOGIN RESPONSE
    // =========================

    public static class LoginResponse {

        private String token;
        private Long id;
        private String firstName;
        private String lastName;
        private String userEmail;

        private com.keystones.keystones.backend.ENUM.Role role;

        public LoginResponse(
                String token,
                Long id,
                String firstName,
                String lastName,
                String userEmail,
                com.keystones.keystones.backend.ENUM.Role role) {

            this.token = token;
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.userEmail = userEmail;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public Long getId() {
            return id;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getUserEmail() {
            return userEmail;
        }

        public com.keystones.keystones.backend.ENUM.Role getRole() {
            return role;
        }
    }


    // =========================
    // FORGOT PASSWORD REQUEST
    // =========================

    public static class ForgotPasswordRequest {

        private String userEmail;

        public String getUserEmail() {
            return userEmail;
        }

        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }
    }


    // =========================
    // FORGOT PASSWORD RESPONSE
    // =========================

    public static class ForgotPasswordResponse {

        private String message;
        private String resetToken;

        public ForgotPasswordResponse(
                String message,
                String resetToken) {

            this.message = message;
            this.resetToken = resetToken;
        }

        public String getMessage() {
            return message;
        }

        public String getResetToken() {
            return resetToken;
        }
    }


    // =========================
    // RESET PASSWORD REQUEST
    // =========================

    public static class ResetPasswordRequest {

        private String token;
        private String newPassword;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}