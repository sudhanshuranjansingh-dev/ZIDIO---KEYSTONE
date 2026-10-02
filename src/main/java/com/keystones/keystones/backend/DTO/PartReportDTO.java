package com.keystones.keystones.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartReportDTO {

    private long totalParts;

    private long lowStockParts;

    private long outOfStockParts;

    private long totalStockQuantity;

    private double totalInventoryValue;
}