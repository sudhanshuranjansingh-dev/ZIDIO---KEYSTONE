package com.keystones.keystones.backend.DTO;

import com.keystones.keystones.backend.ENUM.Role;

public class UserResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String userEmail;
    private String phoneNo;
    private Role role;

    public UserResponseDTO() {
    }

    public UserResponseDTO(Long id, String firstName, String lastName,
                           String userEmail, String phoneNo, Role role) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userEmail = userEmail;
        this.phoneNo = phoneNo;
        this.role = role;
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

    public String getPhoneNo() {
        return phoneNo;
    }

    public Role getRole() {
        return role;
    }
}