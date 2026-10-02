package com.keystones.keystones.backend.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeEntryResponseDTO {

    private Long id;

    private Long workOrderId;
    private String workOrderTitle;

    private Long technicianId;
    private String technicianName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Long durationMinutes;
}