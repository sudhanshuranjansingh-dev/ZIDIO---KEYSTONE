package com.keystones.keystones.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.WorkOrderPartResponseDTO;
import com.keystones.keystones.backend.Entity.Part;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Entity.WorkOrderPart;
import com.keystones.keystones.backend.Repository.PartRepository;
import com.keystones.keystones.backend.Repository.WorkOrderPartRepository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class WorkOrderPartService {

    private final WorkOrderPartRepository workOrderPartRepository;
    private final WorkOrderRepository workOrderRepository;
    private final PartRepository partRepository;

    public WorkOrderPartService(
            WorkOrderPartRepository workOrderPartRepository,
            WorkOrderRepository workOrderRepository,
            PartRepository partRepository) {

        this.workOrderPartRepository = workOrderPartRepository;
        this.workOrderRepository = workOrderRepository;
        this.partRepository = partRepository;
    }

    // Add Part to Work Order
    public WorkOrderPartResponseDTO addPartToWorkOrder(
            Long workOrderId,
            Long partId,
            Integer quantityUsed) {

        if (quantityUsed == null || quantityUsed <= 0) {
            throw new RuntimeException(
                    "Quantity used must be greater than 0!");
        }

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work Order not found with ID: "
                                        + workOrderId));

        Part part = partRepository.findById(partId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Part not found with ID: "
                                        + partId));

        if (quantityUsed > part.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock! Available quantity: "
                            + part.getQuantity());
        }

        // Reduce inventory
        part.setQuantity(
                part.getQuantity() - quantityUsed
        );

        partRepository.save(part);

        // Record part usage
        WorkOrderPart workOrderPart =
                WorkOrderPart.builder()
                        .workOrder(workOrder)
                        .part(part)
                        .quantityUsed(quantityUsed)
                        .build();

        WorkOrderPart savedWorkOrderPart =
                workOrderPartRepository.save(workOrderPart);

        return convertToDTO(savedWorkOrderPart);
    }

    // Get all parts used by a Work Order
    public List<WorkOrderPartResponseDTO> getPartsByWorkOrder(
            Long workOrderId) {

        if (!workOrderRepository.existsById(workOrderId)) {
            throw new RuntimeException(
                    "Work Order not found with ID: "
                            + workOrderId);
        }

        List<WorkOrderPart> workOrderParts =
                workOrderPartRepository
                        .findByWorkOrderId(workOrderId);

        return workOrderParts.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Convert Entity to DTO
    private WorkOrderPartResponseDTO convertToDTO(
            WorkOrderPart workOrderPart) {

        return new WorkOrderPartResponseDTO(
                workOrderPart.getId(),

                workOrderPart.getWorkOrder().getId(),
                workOrderPart.getWorkOrder().getTitle(),

                workOrderPart.getPart().getId(),
                workOrderPart.getPart().getPartCode(),
                workOrderPart.getPart().getPartName(),

                workOrderPart.getQuantityUsed()
        );
    }
}