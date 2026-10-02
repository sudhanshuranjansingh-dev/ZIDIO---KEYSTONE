package com.keystones.keystones.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.DTO.WorkOrderReportDTO;
import com.keystones.keystones.backend.Service.WorkOrderReportService;

@RestController
@RequestMapping("/api/reports")
public class WorkOrderReportController {

    private final WorkOrderReportService workOrderReportService;

    public WorkOrderReportController(
            WorkOrderReportService workOrderReportService) {

        this.workOrderReportService = workOrderReportService;
    }

    @GetMapping("/work-orders")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<WorkOrderReportDTO> getWorkOrderReport() {

        return ResponseEntity.ok(
                workOrderReportService.getWorkOrderReport()
        );
    }
}