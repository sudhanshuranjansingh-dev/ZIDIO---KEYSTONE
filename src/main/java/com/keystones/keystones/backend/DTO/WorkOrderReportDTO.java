package com.keystones.keystones.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderReportDTO {

    private long totalWorkOrders;

    private long openWorkOrders;

    private long assignedWorkOrders;

    private long inProgressWorkOrders;

    private long onHoldWorkOrders;

    private long completedWorkOrders;
}