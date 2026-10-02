package com.keystones.keystones.backend.Service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.keystones.keystones.backend.Repository.PartRepository;
import com.keystones.keystones.backend.Repository.ServiceRequestRepository;
import com.keystones.keystones.backend.Repository.User_Repository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.keystones.keystones.backend.Entity.User;

@Service
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;
    private final User_Repository userRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final PartRepository partRepository;
    
    public DashboardService(
            WorkOrderRepository workOrderRepository,
            User_Repository userRepository,
            ServiceRequestRepository serviceRequestRepository,
            PartRepository partRepository) {

        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.partRepository = partRepository;
    }
    public Map<String, Long> getWorkOrderStatistics() {

        Map<String, Long> statistics = new HashMap<>();

        // Work Order Statistics

        statistics.put(
                "totalWorkOrders",
                workOrderRepository.count()
        );

        statistics.put(
                "openWorkOrders",
                workOrderRepository.countByStatus("OPEN")
        );

        statistics.put(
                "assignedWorkOrders",
                workOrderRepository.countByStatus("ASSIGNED")
        );

        statistics.put(
                "inProgressWorkOrders",
                workOrderRepository.countByStatus("IN_PROGRESS")
        );

        statistics.put(
                "onHoldWorkOrders",
                workOrderRepository.countByStatus("ON_HOLD")
        );

        statistics.put(
                "completedWorkOrders",
                workOrderRepository.countByStatus("COMPLETED")
        );

        // User Statistics

        statistics.put(
                "totalTechnicians",
                userRepository.countByRoleName("TECHNICIAN")
        );

        statistics.put(
                "totalCustomers",
                userRepository.countByRoleName("CUSTOMER")
        );

        // Service Request Statistics

        statistics.put(
                "totalServiceRequests",
                serviceRequestRepository.count()
        );

        statistics.put(
                "openServiceRequests",
                serviceRequestRepository.countByStatus("OPEN")
        );
        
     // Inventory Statistics

        statistics.put(
                "totalParts",
                partRepository.count()
        );

        statistics.put(
                "lowStockParts",
                (long) partRepository.findByQuantityLessThanEqual(
                        5
                ).size()
        );

        return statistics;
    }
    
    public Map<String, Object> getMyDashboard() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"));

        String role = user.getRole().getName();

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("role", role);

        dashboard.put(
                "userName",
                user.getFirstName() + " " + user.getLastName()
        );

        if (role.equals("ADMIN")
                || role.equals("MANAGER")) {

            dashboard.put(
                    "workOrderStatistics",
                    getWorkOrderStatistics()
            );

            return dashboard;
        }

        if (role.equals("DISPATCHER")) {

            dashboard.put(
                    "totalWorkOrders",
                    workOrderRepository.count()
            );

            dashboard.put(
                    "openWorkOrders",
                    workOrderRepository.countByStatus("OPEN")
            );

            dashboard.put(
                    "assignedWorkOrders",
                    workOrderRepository.countByStatus("ASSIGNED")
            );

            dashboard.put(
                    "totalServiceRequests",
                    serviceRequestRepository.count()
            );

            dashboard.put(
                    "openServiceRequests",
                    serviceRequestRepository.countByStatus("OPEN")
            );

            return dashboard;
        }

        if (role.equals("TECHNICIAN")) {

            dashboard.put(
                    "assignedWorkOrders",
                    workOrderRepository
                            .findByTechnicianId(user.getId())
                            .size()
            );

            return dashboard;
        }

        if (role.equals("CUSTOMER")) {

            dashboard.put(
                    "myServiceRequests",
                    serviceRequestRepository
                            .findByCustomer(user)
                            .size()
            );

            dashboard.put(
                    "myWorkOrders",
                    workOrderRepository
                            .findByServiceRequestCustomer(user)
                            .size()
            );

            return dashboard;
        }

        return dashboard;
    }
}