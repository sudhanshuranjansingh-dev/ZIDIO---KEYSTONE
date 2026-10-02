package com.keystones.keystones.backend.Service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.SLAResponseDTO;
import com.keystones.keystones.backend.Entity.SLA;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Repository.SLARepository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class SLAService {

    private final SLARepository slaRepository;
    private final WorkOrderRepository workOrderRepository;

    public SLAService(
            SLARepository slaRepository,
            WorkOrderRepository workOrderRepository) {

        this.slaRepository = slaRepository;
        this.workOrderRepository = workOrderRepository;
    }

    // Create SLA for Work Order
    public SLAResponseDTO createSLA(
            Long workOrderId,
            long responseHours,
            long resolutionHours) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work Order not found with ID: "
                                        + workOrderId));

        if (slaRepository.findByWorkOrderId(workOrderId).isPresent()) {
            throw new RuntimeException(
                    "SLA already exists for Work Order ID: "
                            + workOrderId);
        }

        if (responseHours <= 0 || resolutionHours <= 0) {
            throw new RuntimeException(
                    "Response hours and resolution hours must be greater than 0!");
        }

        LocalDateTime now = LocalDateTime.now();

        SLA sla = SLA.builder()
                .workOrder(workOrder)
                .responseDueAt(
                        now.plusHours(responseHours))
                .resolutionDueAt(
                        now.plusHours(resolutionHours))
                .status("WITHIN_SLA")
                .build();

        SLA savedSLA = slaRepository.save(sla);

        return convertToDTO(savedSLA);
    }

    // Get SLA by Work Order
    public SLAResponseDTO getSLAByWorkOrder(
            Long workOrderId) {

        SLA sla = slaRepository.findByWorkOrderId(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "SLA not found for Work Order ID: "
                                        + workOrderId));

        return convertToDTO(sla);
    }

    // Mark Work Order as responded
    public SLAResponseDTO markResponded(
            Long workOrderId) {

        SLA sla = getSLAEntity(workOrderId);

        if (sla.getRespondedAt() != null) {
            throw new RuntimeException(
                    "Work Order has already been responded to!");
        }

        sla.setRespondedAt(LocalDateTime.now());

        updateSLAStatus(sla);

        SLA savedSLA = slaRepository.save(sla);

        return convertToDTO(savedSLA);
    }

    // Mark Work Order as resolved
    public SLAResponseDTO markResolved(
            Long workOrderId) {

        SLA sla = getSLAEntity(workOrderId);

        if (sla.getResolvedAt() != null) {
            throw new RuntimeException(
                    "Work Order has already been resolved!");
        }

        sla.setResolvedAt(LocalDateTime.now());

        updateSLAStatus(sla);

        SLA savedSLA = slaRepository.save(sla);

        return convertToDTO(savedSLA);
    }

    // Get actual SLA entity internally
    private SLA getSLAEntity(Long workOrderId) {

        return slaRepository.findByWorkOrderId(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "SLA not found for Work Order ID: "
                                        + workOrderId));
    }

    // Update SLA status
    private void updateSLAStatus(SLA sla) {

        LocalDateTime now = LocalDateTime.now();

        if (sla.getResolvedAt() != null) {

            if (sla.getResolvedAt()
                    .isAfter(sla.getResolutionDueAt())) {

                sla.setStatus("BREACHED");

            } else {

                sla.setStatus("WITHIN_SLA");
            }

            return;
        }

        if (now.isAfter(sla.getResolutionDueAt())) {

            sla.setStatus("BREACHED");

        } else if (now.plusHours(2)
                .isAfter(sla.getResolutionDueAt())) {

            sla.setStatus("AT_RISK");

        } else {

            sla.setStatus("WITHIN_SLA");
        }
    }

    // Convert SLA Entity to DTO
    private SLAResponseDTO convertToDTO(SLA sla) {

        return new SLAResponseDTO(
                sla.getId(),
                sla.getWorkOrder().getId(),
                sla.getWorkOrder().getTitle(),
                sla.getResponseDueAt(),
                sla.getResolutionDueAt(),
                sla.getRespondedAt(),
                sla.getResolvedAt(),
                sla.getStatus()
        );
    }
}