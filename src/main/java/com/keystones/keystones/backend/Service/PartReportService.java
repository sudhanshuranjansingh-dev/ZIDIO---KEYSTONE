package com.keystones.keystones.backend.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.DTO.PartReportDTO;
import com.keystones.keystones.backend.Entity.Part;
import com.keystones.keystones.backend.Repository.PartRepository;

@Service
public class PartReportService {

    private final PartRepository partRepository;

    public PartReportService(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    public PartReportDTO getPartReport() {

        List<Part> parts = partRepository.findAll();

        long totalParts = parts.size();

        long lowStockParts = parts.stream()
                .filter(part ->
                        part.getQuantity() <= part.getMinimumStock())
                .count();

        long outOfStockParts = parts.stream()
                .filter(part ->
                        part.getQuantity() == 0)
                .count();

        long totalStockQuantity = parts.stream()
                .mapToLong(part -> part.getQuantity())
                .sum();

        BigDecimal totalInventoryValue = parts.stream()
                .map(part ->
                        part.getUnitPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                part.getQuantity()
                                        )
                                )
                )
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        return new PartReportDTO(
                totalParts,
                lowStockParts,
                outOfStockParts,
                totalStockQuantity,
                totalInventoryValue.doubleValue()
        );
    }
}