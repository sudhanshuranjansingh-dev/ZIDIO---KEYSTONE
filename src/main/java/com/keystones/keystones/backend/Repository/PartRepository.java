package com.keystones.keystones.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keystones.keystones.backend.Entity.Part;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {

    boolean existsByPartCode(String partCode);

    List<Part> findByQuantityLessThanEqual(Integer minimumStock);

}