package com.keystones.keystones.backend.Service;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.WorkOrderReportDTO;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class WorkOrderReportService {

    private final WorkOrderRepository workOrderRepository;

    public WorkOrderReportService(
            WorkOrderRepository workOrderRepository) {

        this.workOrderRepository = workOrderRepository;
    }

    public WorkOrderReportDTO getWorkOrderReport() {

        long totalWorkOrders =
                workOrderRepository.count();

        long openWorkOrders =
                workOrderRepository.countByStatus("OPEN");

        long assignedWorkOrders =
                workOrderRepository.countByStatus("ASSIGNED");

        long inProgressWorkOrders =
                workOrderRepository.countByStatus("IN_PROGRESS");

        long onHoldWorkOrders =
                workOrderRepository.countByStatus("ON_HOLD");

        long completedWorkOrders =
                workOrderRepository.countByStatus("COMPLETED");

        return new WorkOrderReportDTO(
                totalWorkOrders,
                openWorkOrders,
                assignedWorkOrders,
                inProgressWorkOrders,
                onHoldWorkOrders,
                completedWorkOrders
        );
    }
}