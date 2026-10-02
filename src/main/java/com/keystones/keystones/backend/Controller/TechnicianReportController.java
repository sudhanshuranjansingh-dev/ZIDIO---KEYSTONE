package com.keystones.keystones.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.DTO.TechnicianReportDTO;
import com.keystones.keystones.backend.Service.TechnicianReportService;

@RestController
@RequestMapping("/api/reports")
public class TechnicianReportController {

    private final TechnicianReportService technicianReportService;

    public TechnicianReportController(
            TechnicianReportService technicianReportService) {

        this.technicianReportService =
                technicianReportService;
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<List<TechnicianReportDTO>>
            getTechnicianReport() {

        return ResponseEntity.ok(
                technicianReportService.getTechnicianReport()
        );
    }
}