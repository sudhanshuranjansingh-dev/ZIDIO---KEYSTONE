package com.keystones.keystones.backend.Service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.Repository.PartRepository;
import com.keystones.keystones.backend.Repository.ServiceRequestRepository;
import com.keystones.keystones.backend.Repository.User_Repository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class ReportService {

    private final WorkOrderRepository workOrderRepository;
    private final User_Repository userRepository;
    private final PartRepository partRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public ReportService(
            WorkOrderRepository workOrderRepository,
            User_Repository userRepository,
            PartRepository partRepository,
            ServiceRequestRepository serviceRequestRepository) {

        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
        this.partRepository = partRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public Map<String, Object> getSummaryReport() {

        Map<String, Object> report = new LinkedHashMap<>();

        long totalWorkOrders = workOrderRepository.count();

        long completedWorkOrders =
                workOrderRepository.countByStatus("COMPLETED");

        long openWorkOrders =
                workOrderRepository.countByStatus("OPEN");

        long assignedWorkOrders =
                workOrderRepository.countByStatus("ASSIGNED");

        long inProgressWorkOrders =
                workOrderRepository.countByStatus("IN_PROGRESS");

        long onHoldWorkOrders =
                workOrderRepository.countByStatus("ON_HOLD");

        long totalTechnicians =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() != null &&
                                "TECHNICIAN".equals(
                                        user.getRole().getName()
                                )
                        )
                        .count();

        long totalCustomers =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() != null &&
                                "CUSTOMER".equals(
                                        user.getRole().getName()
                                )
                        )
                        .count();

        long totalParts = partRepository.count();

        long totalServiceRequests =
                serviceRequestRepository.count();

        report.put("totalWorkOrders", totalWorkOrders);
        report.put("openWorkOrders", openWorkOrders);
        report.put("assignedWorkOrders", assignedWorkOrders);
        report.put("inProgressWorkOrders", inProgressWorkOrders);
        report.put("onHoldWorkOrders", onHoldWorkOrders);
        report.put("completedWorkOrders", completedWorkOrders);

        report.put("totalTechnicians", totalTechnicians);
        report.put("totalCustomers", totalCustomers);
        report.put("totalParts", totalParts);
        report.put("totalServiceRequests", totalServiceRequests);

        return report;
    }
}