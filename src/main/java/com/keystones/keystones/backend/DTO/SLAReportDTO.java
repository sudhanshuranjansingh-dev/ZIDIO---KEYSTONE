package com.keystones.keystones.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLAReportDTO {

    private long totalSLAs;

    private long completedSLAs;

    private long pendingSLAs;

    private long responseBreachedSLAs;

    private long resolutionBreachedSLAs;
}