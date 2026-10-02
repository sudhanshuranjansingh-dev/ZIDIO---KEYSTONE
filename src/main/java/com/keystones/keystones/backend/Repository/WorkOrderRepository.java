package com.keystones.keystones.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keystones.keystones.backend.Entity.WorkOrder;
import com.keystones.keystones.backend.Entity.ServiceRequest;
import com.keystones.keystones.backend.Entity.User;

public interface WorkOrderRepository
        extends JpaRepository<WorkOrder, Long> {

    List<WorkOrder> findByTechnicianId(Long technicianId);

    List<WorkOrder> findByServiceRequest(
            ServiceRequest serviceRequest);

    List<WorkOrder> findByServiceRequestCustomer(
            User customer);

    long countByStatus(String status);
}