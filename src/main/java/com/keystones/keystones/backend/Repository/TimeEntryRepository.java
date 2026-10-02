package com.keystones.keystones.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keystones.keystones.backend.Entity.TimeEntry;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    List<TimeEntry> findByWorkOrderId(Long workOrderId);

    List<TimeEntry> findByTechnicianId(Long technicianId);

    Optional<TimeEntry> findByWorkOrderIdAndTechnicianIdAndEndTimeIsNull(
            Long workOrderId,
            Long technicianId
    );
}