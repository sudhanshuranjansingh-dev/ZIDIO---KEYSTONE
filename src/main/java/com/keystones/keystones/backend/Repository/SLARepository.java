package com.keystones.keystones.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keystones.keystones.backend.Entity.SLA;

public interface SLARepository extends JpaRepository<SLA, Long> {

    Optional<SLA> findByWorkOrderId(Long workOrderId);

}