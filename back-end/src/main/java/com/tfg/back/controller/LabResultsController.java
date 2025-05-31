package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;
import com.tfg.back.model.dtos.labResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;
import com.tfg.back.service.LabResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(LAB_RESULT)
public class LabResultsController {

    private final LabResultsService labResultService;

    @Autowired
    public LabResultsController(LabResultsService labResultService) {
        this.labResultService = labResultService;
    }

    @PostMapping("/create")
    public ResponseEntity<LabResultDtoGet> createLabResult(@RequestBody LabResultDtoCreate labResult, Authentication authentication) {
        String email = authentication.getName();
        LabResultDtoGet labResultDtoGet = labResultService.sendLabResult(labResult, email);
        return ResponseEntity.ok(labResultDtoGet);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabResultDtoGet> getLabResultById(@PathVariable Long id) {
        LabResultDtoGet labResultDtoGet = labResultService.getLabResultById(id);
        return ResponseEntity.ok(labResultService.getLabResultById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLabResult(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        labResultService.deleteLabResult(id, email);
        return ResponseEntity.noContent().build();
    }
}
