package com.keystones.keystones.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.keystones.keystones.backend.DTO.ServiceRequestDTO;
import com.keystones.keystones.backend.Entity.ServiceRequest;
import com.keystones.keystones.backend.Service.ServiceRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(
            ServiceRequestService serviceRequestService) {

        this.serviceRequestService = serviceRequestService;
    }

    // =========================================================
    // CREATE SERVICE REQUEST
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_WORK_ORDER')")
    public ResponseEntity<ServiceRequest> createServiceRequest(
            @Valid @RequestBody ServiceRequestDTO request) {

        return ResponseEntity.ok(
                serviceRequestService.createServiceRequest(request)
        );
    }

    // =========================================================
    // GET ALL SERVICE REQUESTS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {

        return ResponseEntity.ok(
                serviceRequestService.getAllRequests()
        );
    }

    // =========================================================
    // GET SERVICE REQUEST BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<ServiceRequest> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                serviceRequestService.getRequestById(id)
        );
    }

    // =========================================================
    // GET MY SERVICE REQUESTS
    // =========================================================

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<ServiceRequest>> getMyRequests() {

        return ResponseEntity.ok(
                serviceRequestService.getMyRequests()
        );
    }

    // =========================================================
    // GET REQUESTS BY CUSTOMER
    // =========================================================

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<ServiceRequest>> getRequestsByCustomer(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                serviceRequestService
                        .getRequestsByCustomer(customerId)
        );
    }

    // =========================================================
    // GET REQUESTS BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<ServiceRequest>> getRequestsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                serviceRequestService
                        .getRequestsByStatus(status)
        );
    }
}