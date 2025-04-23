package com.tfg.back.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContact {

    @NotBlank
    @Size(max = 100)
    private String contactName;

    @NotBlank
    @Pattern(regexp = "^\\+?[0-9\\-\\s()]*$")
    private String contactPhone;

    @Size(max = 50)
    private String relationship;
}