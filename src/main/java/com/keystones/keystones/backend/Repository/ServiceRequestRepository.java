package com.keystones.keystones.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keystones.keystones.backend.Entity.ServiceRequest;
import com.keystones.keystones.backend.Entity.User;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCustomer(User customer);

    List<ServiceRequest> findByStatus(String status);

    long countByStatus(String status);
}