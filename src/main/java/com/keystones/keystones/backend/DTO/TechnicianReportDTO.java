package com.keystones.keystones.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianReportDTO {

    private Long technicianId;

    private String technicianName;

    private String technicianEmail;

    private long totalAssignedWorkOrders;

    private long completedWorkOrders;

    private long inProgressWorkOrders;

    private long openWorkOrders;
}