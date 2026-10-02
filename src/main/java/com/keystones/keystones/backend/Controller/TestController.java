package com.keystones.keystones.backend.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String test() {
        return "KEYSTONE Backend is Working!";
    }

    @GetMapping("/secure")
    public String secureTest() {
        return "JWT Authentication is Working!";
    }

    @GetMapping("/technician")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public String technicianTest() {
        return "TECHNICIAN access granted!";
    }

    @GetMapping("/customer")
    @PreAuthorize("hasAuthority('VIEW_DASHBOARD')")
    public String customerAccess() {
        return "Customer permission access granted!";
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public String adminPermissionTest() {
        return "Admin permission access granted!";
    }
}