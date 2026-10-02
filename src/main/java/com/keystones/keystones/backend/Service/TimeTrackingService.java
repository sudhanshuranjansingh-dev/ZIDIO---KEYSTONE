package com.keystones.keystones.backend.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.TimeEntryResponseDTO;
import com.keystones.keystones.backend.Entity.TimeEntry;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Exception.ResourceNotFoundException;
import com.keystones.keystones.backend.Repository.TimeEntryRepository;
import com.keystones.keystones.backend.Repository.User_Repository;
import com.keystones.keystones.backend.Repository.WorkOrderRepository;

@Service
public class TimeTrackingService {

    private final TimeEntryRepository timeEntryRepository;
    private final WorkOrderRepository workOrderRepository;
    private final User_Repository userRepository;

    public TimeTrackingService(
            TimeEntryRepository timeEntryRepository,
            WorkOrderRepository workOrderRepository,
            User_Repository userRepository) {

        this.timeEntryRepository = timeEntryRepository;
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // START WORK
    // =========================================================

    public TimeEntry startWork(
            Long workOrderId,
            Long technicianId) {

        WorkOrder workOrder = workOrderRepository
                .findById(workOrderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work Order not found with ID: "
                                        + workOrderId));

        User technician = userRepository
                .findById(technicianId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Technician not found with ID: "
                                        + technicianId));

        // Check technician ownership
        if (workOrder.getTechnician() == null
                || !workOrder.getTechnician()
                        .getId()
                        .equals(technicianId)) {

            throw new RuntimeException(
                    "This Work Order is not assigned to this technician!");
        }

        // Check whether work is already running
        if (timeEntryRepository
                .findByWorkOrderIdAndTechnicianIdAndEndTimeIsNull(
                        workOrderId,
                        technicianId)
                .isPresent()) {

            throw new RuntimeException(
                    "Work is already running for this Work Order!");
        }

        TimeEntry timeEntry = TimeEntry.builder()
                .workOrder(workOrder)
                .technician(technician)
                .startTime(LocalDateTime.now())
                .build();

        return timeEntryRepository.save(timeEntry);
    }

    // =========================================================
    // STOP WORK
    // =========================================================

    public TimeEntry stopWork(
            Long workOrderId,
            Long technicianId) {

        WorkOrder workOrder = workOrderRepository
                .findById(workOrderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work Order not found with ID: "
                                        + workOrderId));

        // Check technician ownership
        if (workOrder.getTechnician() == null
                || !workOrder.getTechnician()
                        .getId()
                        .equals(technicianId)) {

            throw new RuntimeException(
                    "This Work Order is not assigned to this technician!");
        }

        // Find active time entry
        TimeEntry timeEntry = timeEntryRepository
                .findByWorkOrderIdAndTechnicianIdAndEndTimeIsNull(
                        workOrderId,
                        technicianId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No active work found for this Work Order!"));

        // Set end time
        LocalDateTime endTime = LocalDateTime.now();

        timeEntry.setEndTime(endTime);

        // Calculate duration
        long durationMinutes = Duration
                .between(
                        timeEntry.getStartTime(),
                        endTime)
                .toMinutes();

        timeEntry.setDurationMinutes(durationMinutes);

        return timeEntryRepository.save(timeEntry);
    }

    // =========================================================
    // GET TIME ENTRIES BY WORK ORDER
    // =========================================================

    public List<TimeEntryResponseDTO> getTimeEntriesByWorkOrder(
            Long workOrderId) {

        if (!workOrderRepository.existsById(workOrderId)) {

            throw new ResourceNotFoundException(
                    "Work Order not found with ID: "
                            + workOrderId);
        }

        return timeEntryRepository
                .findByWorkOrderId(workOrderId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // GET TIME ENTRIES BY TECHNICIAN
    // =========================================================

    public List<TimeEntryResponseDTO> getTimeEntriesByTechnician(
            Long technicianId) {

        if (!userRepository.existsById(technicianId)) {

            throw new ResourceNotFoundException(
                    "Technician not found with ID: "
                            + technicianId);
        }

        return timeEntryRepository
                .findByTechnicianId(technicianId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // CONVERT TIME ENTRY TO DTO
    // =========================================================

    private TimeEntryResponseDTO convertToDTO(
            TimeEntry timeEntry) {

        WorkOrder workOrder = timeEntry.getWorkOrder();
        User technician = timeEntry.getTechnician();

        String technicianName = null;

        if (technician != null) {
            technicianName =
                    technician.getFirstName()
                            + " "
                            + technician.getLastName();
        }

        return new TimeEntryResponseDTO(
                timeEntry.getId(),

                workOrder != null
                        ? workOrder.getId()
                        : null,

                workOrder != null
                        ? workOrder.getTitle()
                        : null,

                technician != null
                        ? technician.getId()
                        : null,

                technicianName,

                timeEntry.getStartTime(),
                timeEntry.getEndTime(),
                timeEntry.getDurationMinutes()
        );
    }
}