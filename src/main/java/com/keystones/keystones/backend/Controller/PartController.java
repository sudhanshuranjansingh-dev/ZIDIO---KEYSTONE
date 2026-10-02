package com.keystones.keystones.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.keystones.keystones.backend.Entity.Part;
import com.keystones.keystones.backend.Service.PartService;

@RestController
@RequestMapping("/api/parts")
public class PartController {
	
	// Stock In

	@PostMapping("/{id}/stock-in")
	@PreAuthorize("hasAuthority('MANAGE_PARTS')")
	public ResponseEntity<Part> stockIn(
	        @PathVariable Long id,
	        @RequestParam int quantity) {

	    return ResponseEntity.ok(partService.stockIn(id, quantity));
	}


	// Stock Out

	@PostMapping("/{id}/stock-out")
	@PreAuthorize("hasAuthority('MANAGE_PARTS')")
	public ResponseEntity<Part> stockOut(
	        @PathVariable Long id,
	        @RequestParam int quantity) {

	    return ResponseEntity.ok(partService.stockOut(id, quantity));
	}

    private final PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    // Create Part
    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<Part> createPart(@RequestBody Part part) {

        return ResponseEntity.ok(partService.createPart(part));
    }

    // Get All Parts
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<List<Part>> getAllParts() {

        return ResponseEntity.ok(partService.getAllParts());
    }

    // Get Part By ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<Part> getPartById(@PathVariable Long id) {

        return ResponseEntity.ok(partService.getPartById(id));
    }

    // Update Part
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<Part> updatePart(
            @PathVariable Long id,
            @RequestBody Part part) {

        return ResponseEntity.ok(partService.updatePart(id, part));
    }

    // Delete Part
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<String> deletePart(@PathVariable Long id) {

        partService.deletePart(id);

        return ResponseEntity.ok("Part deleted successfully!");
    }

    // Get Low Stock Parts
    @GetMapping("/low-stock")
    @PreAuthorize("hasAuthority('MANAGE_PARTS')")
    public ResponseEntity<List<Part>> getLowStockParts() {

        return ResponseEntity.ok(partService.getLowStockParts());
    }
}