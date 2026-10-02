package com.keystones.keystones.backend.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.ServiceRequestDTO;
import com.keystones.keystones.backend.Entity.ServiceRequest;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Exception.ResourceNotFoundException;
import com.keystones.keystones.backend.Repository.ServiceRequestRepository;
import com.keystones.keystones.backend.Repository.User_Repository;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final User_Repository userRepository;

    public ServiceRequestService(
            ServiceRequestRepository serviceRequestRepository,
            User_Repository userRepository) {

        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE SERVICE REQUEST
    // =========================================================

    public ServiceRequest createServiceRequest(
            ServiceRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated");
        }

        String userEmail = authentication.getName();

        User customer = userRepository
                .findByUserEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found: "
                                        + userEmail));

        if (customer.getRole() == null ||
                !"CUSTOMER".equals(
                        customer.getRole().getName())) {

            throw new RuntimeException(
                    "Only CUSTOMER users can create service requests");
        }

        ServiceRequest serviceRequest =
                ServiceRequest.builder()
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .priority(request.getPriority())
                        .status("OPEN")
                        .createdAt(LocalDateTime.now())
                        .customer(customer)
                        .build();

        return serviceRequestRepository.save(serviceRequest);
    }

    // =========================================================
    // GET REQUEST BY ID
    // =========================================================

    public ServiceRequest getRequestById(Long id) {

        return serviceRequestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Service Request not found with ID: "
                                        + id));
    }

    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    public List<ServiceRequest> getAllRequests() {

        return serviceRequestRepository.findAll();
    }

    // =========================================================
    // GET REQUESTS BY CUSTOMER
    // =========================================================

    public List<ServiceRequest> getRequestsByCustomer(
            Long customerId) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with ID: "
                                        + customerId));

        return serviceRequestRepository
                .findByCustomer(customer);
    }

    // =========================================================
    // GET MY REQUESTS
    // =========================================================

    public List<ServiceRequest> getMyRequests() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated");
        }

        String userEmail = authentication.getName();

        User customer = userRepository
                .findByUserEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found: "
                                        + userEmail));

        return serviceRequestRepository
                .findByCustomer(customer);
    }

    // =========================================================
    // GET REQUESTS BY STATUS
    // =========================================================

    public List<ServiceRequest> getRequestsByStatus(
            String status) {

        return serviceRequestRepository
                .findByStatus(status);
    }
}