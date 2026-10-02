package com.keystones.keystones.backend.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.SLAReportDTO;
import com.keystones.keystones.backend.Entity.SLA;
import com.keystones.keystones.backend.Repository.SLARepository;

@Service
public class SLAReportService {

    private final SLARepository slaRepository;

    public SLAReportService(SLARepository slaRepository) {
        this.slaRepository = slaRepository;
    }

    public SLAReportDTO getSLAReport() {

        List<SLA> slas = slaRepository.findAll();

        long totalSLAs = slas.size();

        long completedSLAs = slas.stream()
                .filter(sla ->
                        sla.getResolvedAt() != null)
                .count();

        long pendingSLAs = slas.stream()
                .filter(sla ->
                        sla.getResolvedAt() == null)
                .count();

        LocalDateTime now = LocalDateTime.now();

        long responseBreachedSLAs = slas.stream()
                .filter(sla ->
                        sla.getRespondedAt() == null
                        && now.isAfter(sla.getResponseDueAt()))
                .count();

        long resolutionBreachedSLAs = slas.stream()
                .filter(sla ->
                        sla.getResolvedAt() == null
                        && now.isAfter(sla.getResolutionDueAt()))
                .count();

        return new SLAReportDTO(
                totalSLAs,
                completedSLAs,
                pendingSLAs,
                responseBreachedSLAs,
                resolutionBreachedSLAs
        );
    }
}