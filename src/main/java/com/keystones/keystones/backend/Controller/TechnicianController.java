package com.keystones.keystones.backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Repository.User_Repository;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final User_Repository userRepository;

    public TechnicianController(User_Repository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all technicians
    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<User>> getAllTechnicians() {

        List<User> technicians = userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() != null &&
                        "TECHNICIAN".equals(
                                user.getRole().getName()
                        )
                )
                .collect(Collectors.toList());

        return ResponseEntity.ok(technicians);
    }

    // Get technician by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<User> getTechnicianById(
            @PathVariable Long id) {

        User technician = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Technician not found with ID: " + id
                        )
                );

        if (technician.getRole() == null ||
                !"TECHNICIAN".equals(
                        technician.getRole().getName()
                )) {

            throw new RuntimeException(
                    "User with ID " + id +
                    " is not a TECHNICIAN"
            );
        }

        return ResponseEntity.ok(technician);
    }
}