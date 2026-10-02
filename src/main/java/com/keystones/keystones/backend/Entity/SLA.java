package com.keystones.keystones.backend.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "slas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SLA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false, unique = true)
    private WorkOrder workOrder;

    @Column(nullable = false)
    private LocalDateTime responseDueAt;

    @Column(nullable = false)
    private LocalDateTime resolutionDueAt;

    private LocalDateTime respondedAt;

    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    private String status;
}