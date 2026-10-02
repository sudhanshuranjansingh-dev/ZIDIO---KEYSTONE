package com.keystones.keystones.backend.Controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.DTO.WorkOrderRequestDTO;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Service.WorkOrderService;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    // =========================================================
    // GET ALL WORK ORDERS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<List<WorkOrder>> getAllWorkOrders() {

        return ResponseEntity.ok(
                workOrderService.getAllWorkOrders()
        );
    }

    // =========================================================
    // GET WORK ORDER BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<WorkOrder> getWorkOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrderById(id)
        );
    }

    // =========================================================
    // CREATE WORK ORDER
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_WORK_ORDER')")
    public ResponseEntity<WorkOrder> createWorkOrder(
            @Valid @RequestBody WorkOrderRequestDTO request) {

        return ResponseEntity.ok(
                workOrderService.createWorkOrder(request)
        );
    }

    // =========================================================
    // CONVERT SERVICE REQUEST TO WORK ORDER
    // =========================================================

    @PostMapping("/from-service-request/{serviceRequestId}")
    @PreAuthorize("hasAuthority('CREATE_WORK_ORDER')")
    public ResponseEntity<WorkOrder> convertServiceRequestToWorkOrder(
            @PathVariable Long serviceRequestId) {

        return ResponseEntity.ok(
                workOrderService.convertServiceRequestToWorkOrder(
                        serviceRequestId
                )
        );
    }

    // =========================================================
    // UPDATE WORK ORDER
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_WORK_ORDER')")
    public ResponseEntity<WorkOrder> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrderRequestDTO request) {

        return ResponseEntity.ok(
                workOrderService.updateWorkOrder(id, request)
        );
    }

    // =========================================================
    // ASSIGN TECHNICIAN
    // =========================================================

    @PutMapping("/{workOrderId}/assign-technician")
    @PreAuthorize("hasAuthority('ASSIGN_TECHNICIAN')")
    public ResponseEntity<WorkOrder> assignTechnician(
            @PathVariable Long workOrderId,
            @RequestParam Long technicianId) {

        return ResponseEntity.ok(
                workOrderService.assignTechnician(
                        workOrderId,
                        technicianId
                )
        );
    }

    // =========================================================
    // UPDATE WORK ORDER STATUS
    // =========================================================

    @PutMapping("/{workOrderId}/status")
    @PreAuthorize("hasAuthority('UPDATE_WORK_STATUS')")
    public ResponseEntity<WorkOrder> updateWorkStatus(
            @PathVariable Long workOrderId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                workOrderService.updateWorkStatus(
                        workOrderId,
                        status
                )
        );
    }

    // =========================================================
    // DELETE WORK ORDER
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_WORK_ORDER')")
    public ResponseEntity<String> deleteWorkOrder(
            @PathVariable Long id) {

        workOrderService.deleteWorkOrder(id);

        return ResponseEntity.ok(
                "Work Order deleted successfully!"
        );
    }
}