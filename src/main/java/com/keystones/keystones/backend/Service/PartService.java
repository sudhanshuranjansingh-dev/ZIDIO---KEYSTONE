package com.keystones.keystones.backend.Service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.keystones.keystones.backend.Entity.Part;
import com.keystones.keystones.backend.Exception.ResourceNotFoundException;
import com.keystones.keystones.backend.Repository.PartRepository;

@Service
public class PartService {

    private final PartRepository partRepository;

    public PartService(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    // Create Part
    public Part createPart(Part part) {

        if (partRepository.existsByPartCode(part.getPartCode())) {
            throw new RuntimeException("Part code already exists!");
        }

        return partRepository.save(part);
    }

    // Get All Parts
    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    // Get Part By ID
    public Part getPartById(Long id) {

        return partRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Part not found with ID: " + id));
    }

    // Update Part
    public Part updatePart(Long id, Part updatedPart) {

        Part existingPart = partRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Part not found with ID: " + id));

        // Check if another part already uses the new part code
        if (!existingPart.getPartCode().equals(updatedPart.getPartCode())
                && partRepository.existsByPartCode(updatedPart.getPartCode())) {

            throw new RuntimeException("Part code already exists!");
        }

        existingPart.setPartCode(updatedPart.getPartCode());
        existingPart.setPartName(updatedPart.getPartName());
        existingPart.setDescription(updatedPart.getDescription());
        existingPart.setQuantity(updatedPart.getQuantity());
        existingPart.setMinimumStock(updatedPart.getMinimumStock());
        existingPart.setUnitPrice(updatedPart.getUnitPrice());

        return partRepository.save(existingPart);
    }

    // Delete Part
    public void deletePart(Long id) {

        if (!partRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Part not found with ID: " + id);
        }

        try {

            partRepository.deleteById(id);

        } catch (DataIntegrityViolationException e) {

            throw new RuntimeException(
                    "Cannot delete this part because it is currently used in a work order."
            );
        }
    }

    // Get Low Stock Parts
    public List<Part> getLowStockParts() {

        return partRepository.findAll()
                .stream()
                .filter(part ->
                        part.getQuantity() <= part.getMinimumStock())
                .toList();
    }

    // Stock In
    public Part stockIn(Long id, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Stock-in quantity must be greater than 0!");
        }

        Part part = partRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Part not found with ID: " + id));

        part.setQuantity(part.getQuantity() + quantity);

        return partRepository.save(part);
    }

    // Stock Out
    public Part stockOut(Long id, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Stock-out quantity must be greater than 0!");
        }

        Part part = partRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Part not found with ID: " + id));

        if (quantity > part.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock! Available quantity: "
                            + part.getQuantity()
            );
        }

        part.setQuantity(part.getQuantity() - quantity);

        return partRepository.save(part);
    }
}