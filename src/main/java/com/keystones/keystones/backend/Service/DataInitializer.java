package com.keystones.keystones.backend.Service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.keystones.keystones.backend.ENUM.Role;
import com.keystones.keystones.backend.Entity.Permission;
import com.keystones.keystones.backend.Repository.PermissionRepository;
import com.keystones.keystones.backend.Repository.RoleRepository;

import jakarta.transaction.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    public DataInitializer(
            PermissionRepository permissionRepository,
            RoleRepository roleRepository) {

        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        // ==========================================
        // CREATE PERMISSIONS
        // ==========================================

        createPermission("CREATE_WORK_ORDER",
                "Create a new work order");

        createPermission("VIEW_WORK_ORDER",
                "View work orders");

        createPermission("UPDATE_WORK_ORDER",
                "Update work orders");

        createPermission("DELETE_WORK_ORDER",
                "Delete work orders");

        createPermission("ASSIGN_TECHNICIAN",
                "Assign technicians to work orders");

        createPermission("UPDATE_WORK_STATUS",
                "Update work order status");

        createPermission("VIEW_CUSTOMERS",
                "View customer information");

        createPermission("MANAGE_USERS",
                "Manage system users");

        createPermission("VIEW_REPORTS",
                "View reports");

        createPermission("MANAGE_PARTS",
                "Manage parts and inventory");

        createPermission("TRACK_TIME",
                "Track technician working time");

        createPermission("VIEW_DASHBOARD",
                "View dashboard");


        // ==========================================
        // CREATE ROLES
        // ==========================================

        Role admin = getOrCreateRole("ADMIN");

        Role dispatcher = getOrCreateRole("DISPATCHER");

        Role technician = getOrCreateRole("TECHNICIAN");

        Role customer = getOrCreateRole("CUSTOMER");

        Role manager = getOrCreateRole("MANAGER");


        // ==========================================
        // ADMIN PERMISSIONS
        // ==========================================

        admin.setPermissions(new HashSet<>(Set.of(
                getPermission("CREATE_WORK_ORDER"),
                getPermission("VIEW_WORK_ORDER"),
                getPermission("UPDATE_WORK_ORDER"),
                getPermission("DELETE_WORK_ORDER"),
                getPermission("ASSIGN_TECHNICIAN"),
                getPermission("UPDATE_WORK_STATUS"),
                getPermission("VIEW_CUSTOMERS"),
                getPermission("MANAGE_USERS"),
                getPermission("VIEW_REPORTS"),
                getPermission("MANAGE_PARTS"),
                getPermission("TRACK_TIME"),
                getPermission("VIEW_DASHBOARD")
        )));


        // ==========================================
        // DISPATCHER PERMISSIONS
        // ==========================================

        dispatcher.setPermissions(new HashSet<>(Set.of(
                getPermission("CREATE_WORK_ORDER"),
                getPermission("VIEW_WORK_ORDER"),
                getPermission("UPDATE_WORK_ORDER"),
                getPermission("ASSIGN_TECHNICIAN"),
                getPermission("VIEW_CUSTOMERS"),
                getPermission("VIEW_DASHBOARD")
        )));


        // ==========================================
        // TECHNICIAN PERMISSIONS
        // ==========================================

        technician.setPermissions(new HashSet<>(Set.of(
                getPermission("VIEW_WORK_ORDER"),
                getPermission("UPDATE_WORK_STATUS"),
                getPermission("TRACK_TIME"),
                getPermission("MANAGE_PARTS"),
                getPermission("VIEW_DASHBOARD")
        )));


        // ==========================================
        // CUSTOMER PERMISSIONS
        // ==========================================

        customer.setPermissions(new HashSet<>(Set.of(
                getPermission("CREATE_WORK_ORDER"),
                getPermission("VIEW_WORK_ORDER"),
                getPermission("VIEW_DASHBOARD")
        )));


        // ==========================================
        // MANAGER PERMISSIONS
        // ==========================================

        manager.setPermissions(new HashSet<>(Set.of(
                getPermission("VIEW_WORK_ORDER"),
                getPermission("UPDATE_WORK_ORDER"),
                getPermission("VIEW_CUSTOMERS"),
                getPermission("VIEW_REPORTS"),
                getPermission("VIEW_DASHBOARD")
        )));


        // ==========================================
        // SAVE ROLES
        // ==========================================

        roleRepository.save(admin);
        roleRepository.save(dispatcher);
        roleRepository.save(technician);
        roleRepository.save(customer);
        roleRepository.save(manager);

        System.out.println("Roles and permissions initialized successfully.");
    }


    // ==========================================
    // CREATE PERMISSION IF NOT EXISTS
    // ==========================================

    private void createPermission(
            String name,
            String description) {

        if (permissionRepository.findByName(name).isEmpty()) {

            Permission permission = Permission.builder()
                    .name(name)
                    .description(description)
                    .build();

            permissionRepository.save(permission);

            System.out.println("Permission created: " + name);
        }
    }


    // ==========================================
    // GET PERMISSION
    // ==========================================

    private Permission getPermission(String name) {

        return permissionRepository
                .findByName(name)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Permission not found: " + name));
    }


    // ==========================================
    // CREATE ROLE IF NOT EXISTS
    // ==========================================

    private Role getOrCreateRole(String name) {

        return roleRepository
                .findByName(name)
                .orElseGet(() -> {

                    Role role = Role.builder()
                            .name(name)
                            .build();

                    System.out.println(
                            "Role created: " + name);

                    return roleRepository.save(role);
                });
    }
}