package com.keystones.keystones.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.DTO.SLAReportDTO;
import com.keystones.keystones.backend.Service.SLAReportService;

@RestController
@RequestMapping("/api/reports")
public class SLAReportController {

    private final SLAReportService slaReportService;

    public SLAReportController(
            SLAReportService slaReportService) {
        this.slaReportService = slaReportService;
    }

    @GetMapping("/sla")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<SLAReportDTO> getSLAReport() {

        return ResponseEntity.ok(
                slaReportService.getSLAReport()
        );
    }
}