package com.keystones.keystones.backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class ServiceRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

}