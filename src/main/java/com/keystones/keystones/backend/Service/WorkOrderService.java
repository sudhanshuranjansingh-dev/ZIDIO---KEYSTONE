package com.keystones.keystones.backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.keystones.keystones.backend.Exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.keystones.keystones.backend.Entity.ServiceRequest;
import com.keystones.keystones.backend.Repository.ServiceRequestRepository;
import com.keystones.keystones.backend.DTO.WorkOrderRequestDTO;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Repository.User_Repository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final User_Repository userRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            User_Repository userRepository,
            ServiceRequestRepository serviceRequestRepository) {

        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    // =========================================================
    // Create Work Order
    // =========================================================

    public WorkOrder createWorkOrder(WorkOrderRequestDTO request) {

        WorkOrder workOrder = WorkOrder.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus() != null
                        ? request.getStatus()
                        : "OPEN")
                .createdAt(LocalDateTime.now())
                .scheduledDate(request.getScheduledDate())
                .build();

        return workOrderRepository.save(workOrder);
    }

    // =========================================================
    // Get All Work Orders
    // =========================================================

    public List<WorkOrder> getAllWorkOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));

        String roleName = loggedInUser.getRole().getName();

        // Admin, Dispatcher and Manager can see all Work Orders
        if (roleName.equals("ADMIN")
                || roleName.equals("DISPATCHER")
                || roleName.equals("MANAGER")) {

            return workOrderRepository.findAll();
        }

        // Technician can see only assigned Work Orders
        if (roleName.equals("TECHNICIAN")) {

            return workOrderRepository
                    .findByTechnicianId(loggedInUser.getId());
        }

        // Customer currently gets no Work Orders
        if (roleName.equals("CUSTOMER")) {

            return workOrderRepository
                    .findByServiceRequestCustomer(loggedInUser);
        }

        return List.of();
    }

    // =========================================================
    // Get Work Order By ID
    // =========================================================

    public WorkOrder getWorkOrderById(Long id) {

        WorkOrder workOrder = workOrderRepository.findById(id)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Work Order not found with ID: " + id));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));

        String roleName = loggedInUser.getRole().getName();

        // Admin, Dispatcher and Manager can access all Work Orders
        if (roleName.equals("ADMIN")
                || roleName.equals("DISPATCHER")
                || roleName.equals("MANAGER")) {

            return workOrder;
        }

        // Technician can access only their assigned Work Orders
        if (roleName.equals("TECHNICIAN")) {

            if (workOrder.getTechnician() == null
                    || !workOrder.getTechnician().getId()
                            .equals(loggedInUser.getId())) {

                throw new RuntimeException(
                        "You are not authorized to access this Work Order");
            }

            return workOrder;
        }

        // Customer currently cannot access Work Orders
        if (roleName.equals("CUSTOMER")) {

            if (workOrder.getServiceRequest() == null
                    || workOrder.getServiceRequest().getCustomer() == null
                    || !workOrder.getServiceRequest()
                            .getCustomer()
                            .getId()
                            .equals(loggedInUser.getId())) {

                throw new RuntimeException(
                        "You are not authorized to access this Work Order");
            }

            return workOrder;
        }

        throw new RuntimeException(
                "You are not authorized to access this Work Order");
    }

    // =========================================================
    // Update Work Order
    // =========================================================

    public WorkOrder updateWorkOrder(
            Long id,
            WorkOrderRequestDTO request) {

        WorkOrder workOrder = workOrderRepository.findById(id)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Work Order not found with ID: " + id));

        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setPriority(request.getPriority());
        workOrder.setStatus(request.getStatus());
        workOrder.setScheduledDate(request.getScheduledDate());

        return workOrderRepository.save(workOrder);
    }

    // =========================================================
    // Delete Work Order
    // =========================================================

    public void deleteWorkOrder(Long id) {

    	if (!workOrderRepository.existsById(id)) {

    	    throw new ResourceNotFoundException(
    	            "Work Order not found with ID: " + id);
    	}

        workOrderRepository.deleteById(id);
    }

    // =========================================================
    // Validate Work Order Status Transition
    // =========================================================

    private boolean isValidStatusTransition(
            String currentStatus,
            String newStatus) {

        if (currentStatus == null || newStatus == null) {
            return false;
        }

        // OPEN -> ASSIGNED
        if (currentStatus.equals("OPEN")
                && newStatus.equals("ASSIGNED")) {

            return true;
        }

        // ASSIGNED -> IN_PROGRESS
        if (currentStatus.equals("ASSIGNED")
                && newStatus.equals("IN_PROGRESS")) {

            return true;
        }

        // IN_PROGRESS -> ON_HOLD
        // IN_PROGRESS -> COMPLETED
        if (currentStatus.equals("IN_PROGRESS")
                && (newStatus.equals("ON_HOLD")
                        || newStatus.equals("COMPLETED"))) {

            return true;
        }

        // ON_HOLD -> IN_PROGRESS
        if (currentStatus.equals("ON_HOLD")
                && newStatus.equals("IN_PROGRESS")) {

            return true;
        }

        return false;
    }

    // =========================================================
    // Update Work Order Status
    // =========================================================

    public WorkOrder updateWorkStatus(
            Long workOrderId,
            String status) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Work Order not found with ID: " + workOrderId));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"));

        String roleName = loggedInUser.getRole().getName();

        // =====================================================
        // Check Technician Ownership
        // =====================================================

        if (roleName.equals("TECHNICIAN")) {

            if (workOrder.getTechnician() == null
                    || !workOrder.getTechnician().getId()
                            .equals(loggedInUser.getId())) {

                throw new RuntimeException(
                        "You are not authorized to update this Work Order");
            }
        }

        // =====================================================
        // Check Allowed Roles
        // =====================================================

        else if (roleName.equals("ADMIN")
                || roleName.equals("DISPATCHER")
                || roleName.equals("MANAGER")) {

            // These roles can update Work Orders
        }

        // Other roles cannot update Work Orders
        else {

            throw new RuntimeException(
                    "You are not authorized to update this Work Order");
        }

        // =====================================================
        // Validate Status Transition
        // =====================================================

        String currentStatus = workOrder.getStatus();

        if (!isValidStatusTransition(currentStatus, status)) {

            throw new RuntimeException(
                    "Invalid status transition: "
                            + currentStatus
                            + " -> "
                            + status);
        }

        // =====================================================
        // Update Status
        // =====================================================

        workOrder.setStatus(status);

        // =====================================================
        // Set Completion Time
        // =====================================================

        if ("COMPLETED".equalsIgnoreCase(status)) {

            workOrder.setCompletedAt(LocalDateTime.now());
        }

        return workOrderRepository.save(workOrder);
    }

    // =========================================================
    // Assign Technician
    // =========================================================

    public WorkOrder assignTechnician(
            Long workOrderId,
            Long technicianId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Work Order not found with ID: "
                                + workOrderId));

        User technician = userRepository.findById(technicianId)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found with ID: "
                                + technicianId));

        if (!technician.getRole().getName().equals("TECHNICIAN")) {

            throw new RuntimeException(
                    "Selected user is not a TECHNICIAN");
        }

        workOrder.setTechnician(technician);

        return workOrderRepository.save(workOrder);
    }
 // =========================================================
 // Convert Service Request to Work Order
 // =========================================================

 public WorkOrder convertServiceRequestToWorkOrder(Long serviceRequestId) {

     // Find Service Request
     ServiceRequest serviceRequest =
             serviceRequestRepository.findById(serviceRequestId)
             .orElseThrow(() ->
             new ResourceNotFoundException(
                     "Service Request not found with ID: "
                             + serviceRequestId));

     // Prevent duplicate conversion
     List<WorkOrder> existingWorkOrders =
             workOrderRepository.findByServiceRequest(serviceRequest);

     if (!existingWorkOrders.isEmpty()) {

         throw new RuntimeException(
                 "This Service Request has already been converted to a Work Order");
     }

     // Create Work Order from Service Request
     WorkOrder workOrder = WorkOrder.builder()
             .title(serviceRequest.getTitle())
             .description(serviceRequest.getDescription())
             .priority(serviceRequest.getPriority())
             .status("OPEN")
             .createdAt(LocalDateTime.now())
             .serviceRequest(serviceRequest)
             .build();

     return workOrderRepository.save(workOrder);
 }
}