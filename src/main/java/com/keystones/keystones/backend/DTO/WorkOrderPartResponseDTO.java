package com.keystones.keystones.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderPartResponseDTO {

    private Long id;

    private Long workOrderId;
    private String workOrderTitle;

    private Long partId;
    private String partCode;
    private String partName;

    private Integer quantityUsed;
}