package com.keystones.keystones.backend.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.UserRegistrationDTO;
import com.keystones.keystones.backend.ENUM.Role;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Repository.RoleRepository;
import com.keystones.keystones.backend.Repository.User_Repository;

import java.util.List;

@Service
public class UserService {

    private final User_Repository userRepository;
    private final RoleRepository roleRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(
            User_Repository userRepository,
            RoleRepository roleRepository) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // =====================================================
    // PUBLIC REGISTRATION
    // =====================================================

    // Every newly registered user automatically becomes CUSTOMER
    public User createUser(UserRegistrationDTO dto) {

        Role customerRole = roleRepository.findAll()
                .stream()
                .filter(role ->
                        role.getName() != null &&
                        "CUSTOMER".equalsIgnoreCase(
                                role.getName()
                        )
                )
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "CUSTOMER role not found in database!"
                        )
                );

        User user = new User();

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setUserEmail(dto.getUserEmail());
        user.setPhoneNo(dto.getPhoneNo());

        user.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );

        user.setRole(customerRole);

        return userRepository.save(user);
    }


    // =====================================================
    // ADMIN USER MANAGEMENT
    // =====================================================

    // Get all users
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // Get user by ID
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: " + id
                        )
                );
    }
    
    // Delete user
    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }


    // Update user information
    public User updateUser(
            Long id,
            String firstName,
            String lastName,
            String userEmail,
            String phoneNo,
            Long roleId) {

        User user = getUserById(id);

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUserEmail(userEmail);
        user.setPhoneNo(phoneNo);

        if (roleId != null) {

            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Role not found with ID: "
                                            + roleId
                            )
                    );

            user.setRole(role);
        }

        return userRepository.save(user);
    }





    // =====================================================
    // ADMIN PASSWORD RESET
    // =====================================================

    public void resetAdminPassword(
            String email,
            String newPassword) {

        User admin = userRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Admin user not found with email: "
                                        + email
                        ));

        admin.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(admin);
    }
}