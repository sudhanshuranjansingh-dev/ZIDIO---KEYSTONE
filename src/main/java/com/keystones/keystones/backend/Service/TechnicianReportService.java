package com.keystones.keystones.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.TechnicianReportDTO;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Repository.User_Repository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class TechnicianReportService {

    private final User_Repository userRepository;
    private final WorkOrderRepository workOrderRepository;

    public TechnicianReportService(
            User_Repository userRepository,
            WorkOrderRepository workOrderRepository) {

        this.userRepository = userRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public List<TechnicianReportDTO> getTechnicianReport() {

        List<User> technicians = userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() != null
                                && "TECHNICIAN".equals(
                                        user.getRole().getName()))
                .toList();

        List<TechnicianReportDTO> reports =
                new ArrayList<>();

        for (User technician : technicians) {

            List<WorkOrder> workOrders =
                    workOrderRepository.findByTechnicianId(
                            technician.getId());

            long totalAssigned =
                    workOrders.size();

            long completed =
                    workOrders.stream()
                            .filter(workOrder ->
                                    "COMPLETED".equalsIgnoreCase(
                                            workOrder.getStatus()))
                            .count();

            long inProgress =
                    workOrders.stream()
                            .filter(workOrder ->
                                    "IN_PROGRESS".equalsIgnoreCase(
                                            workOrder.getStatus()))
                            .count();

            long open =
                    workOrders.stream()
                            .filter(workOrder ->
                                    "OPEN".equalsIgnoreCase(
                                            workOrder.getStatus()))
                            .count();

            String technicianName =
                    technician.getFirstName()
                            + " "
                            + technician.getLastName();

            TechnicianReportDTO report =
                    new TechnicianReportDTO(
                            technician.getId(),
                            technicianName,
                            technician.getUserEmail(),
                            totalAssigned,
                            completed,
                            inProgress,
                            open
                    );

            reports.add(report);
        }

        return reports;
    }
}