package com.keystones.keystones.backend.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keystones.keystones.backend.Service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/work-orders")
    @PreAuthorize("hasAuthority('VIEW_DASHBOARD')")
    public ResponseEntity<Map<String, Long>> getWorkOrderStatistics() {

        return ResponseEntity.ok(
                dashboardService.getWorkOrderStatistics()
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('VIEW_DASHBOARD')")
    public ResponseEntity<Map<String, Object>> getMyDashboard() {

        return ResponseEntity.ok(
                dashboardService.getMyDashboard()
        );
    }
}