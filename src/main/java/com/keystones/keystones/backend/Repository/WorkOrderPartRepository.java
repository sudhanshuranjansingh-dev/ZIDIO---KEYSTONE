package com.keystones.keystones.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keystones.keystones.backend.Entity.WorkOrderPart;

public interface WorkOrderPartRepository extends JpaRepository<WorkOrderPart, Long> {

    List<WorkOrderPart> findByWorkOrderId(Long workOrderId);

}