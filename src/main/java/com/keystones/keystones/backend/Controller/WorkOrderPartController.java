package com.keystones.keystones.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.keystones.keystones.backend.DTO.WorkOrderPartResponseDTO;
import com.keystones.keystones.backend.Service.WorkOrderPartService;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderPartController {

    private final WorkOrderPartService workOrderPartService;

    public WorkOrderPartController(
            WorkOrderPartService workOrderPartService) {
        this.workOrderPartService = workOrderPartService;
    }

    // Add Part to Work Order
    @PostMapping("/{workOrderId}/parts/{partId}")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<WorkOrderPartResponseDTO> addPartToWorkOrder(
            @PathVariable Long workOrderId,
            @PathVariable Long partId,
            @RequestParam Integer quantityUsed) {

        return ResponseEntity.ok(
                workOrderPartService.addPartToWorkOrder(
                        workOrderId,
                        partId,
                        quantityUsed));
    }

    // Get Parts Used by Work Order
    @GetMapping("/{workOrderId}/parts")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<List<WorkOrderPartResponseDTO>> getPartsByWorkOrder(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                workOrderPartService.getPartsByWorkOrder(workOrderId));
    }
}