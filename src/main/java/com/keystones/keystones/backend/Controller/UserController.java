package com.keystones.keystones.backend.Controller;

import com.keystones.keystones.backend.DTO.UserResponseDTO;
import com.keystones.keystones.backend.DTO.UserRegistrationDTO;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // =====================================================
    // PUBLIC USER REGISTRATION
    // =====================================================

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody UserRegistrationDTO userDTO) {

        User savedUser =
                userService.createUser(userDTO);

        return ResponseEntity.ok(
                convertToDTO(savedUser)
        );
    }


    // =====================================================
    // ADMIN USER MANAGEMENT
    // =====================================================

    // Get all users
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        List<UserResponseDTO> users =
                userService.getAllUsers()
                        .stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }


    // Get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id) {

        User user =
                userService.getUserById(id);

        return ResponseEntity.ok(
                convertToDTO(user)
        );
    }


    // Update user
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String userEmail,
            @RequestParam String phoneNo,
            @RequestParam(required = false) Long roleId) {

        User updatedUser =
                userService.updateUser(
                        id,
                        firstName,
                        lastName,
                        userEmail,
                        phoneNo,
                        roleId
                );

        return ResponseEntity.ok(
                convertToDTO(updatedUser)
        );
    }


    // Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted successfully."
        );
    }


    // =====================================================
    // DTO CONVERTER
    // =====================================================

    private UserResponseDTO convertToDTO(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserEmail(),
                user.getPhoneNo(),
                user.getRole()
        );
    }
}