package com.keystones.keystones.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.DTO.PartReportDTO;
import com.keystones.keystones.backend.Service.PartReportService;

@RestController
@RequestMapping("/api/reports")
public class PartReportController {

    private final PartReportService partReportService;

    public PartReportController(
            PartReportService partReportService) {

        this.partReportService = partReportService;
    }

    @GetMapping("/parts")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<PartReportDTO> getPartReport() {

        return ResponseEntity.ok(
                partReportService.getPartReport()
        );
    }
}