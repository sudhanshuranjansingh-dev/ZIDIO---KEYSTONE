package com.keystones.keystones.backend.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLAResponseDTO {

    private Long id;

    private Long workOrderId;
    private String workOrderTitle;

    private LocalDateTime responseDueAt;
    private LocalDateTime resolutionDueAt;

    private LocalDateTime respondedAt;
    private LocalDateTime resolvedAt;

    private String status;
}