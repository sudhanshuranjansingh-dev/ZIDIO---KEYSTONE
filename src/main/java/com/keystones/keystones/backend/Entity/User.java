package com.keystones.keystones.backend.Entity;

import com.keystones.keystones.backend.ENUM.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.NoArgsConstructor;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String firstName;


    @Column(nullable = false)
    private String lastName;


    @Column(nullable = true, unique = true)
    private String userEmail;


    @Column(nullable = false)
    private String phoneNo;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;


    @JsonIgnore
    @Column(nullable = false)
    private String password;


    // =========================
    // PASSWORD RESET
    // =========================

    @JsonIgnore
    @Column(name = "reset_token")
    private String resetToken;


    @JsonIgnore
    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;
}