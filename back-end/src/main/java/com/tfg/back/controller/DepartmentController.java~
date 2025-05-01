package com.tfg.back.controller;

import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentCreateDto;
import com.tfg.back.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.findAll());
    }

    @PostMapping
    public ResponseEntity<Void> createDepartment(@Valid @RequestBody DepartmentCreateDto department) {
        departmentService.createDepartment(department);
        return ResponseEntity.ok().build();
    }
}
