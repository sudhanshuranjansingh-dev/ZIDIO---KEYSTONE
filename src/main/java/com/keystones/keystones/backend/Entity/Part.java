package com.keystones.keystones.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "parts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String partCode;

    @Column(nullable = false)
    private String partName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer minimumStock;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
}