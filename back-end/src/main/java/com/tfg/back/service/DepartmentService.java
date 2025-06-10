package com.tfg.back.service;

import com.tfg.back.exceptions.department.DepartmentAlreadyExistsException;
import com.tfg.back.exceptions.department.DepartmentNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentDtoCreate;
import com.tfg.back.model.dtos.department.DepartmentDtoUpdate;

import java.util.List;

/**
 * Service implementation for managing departments.
 * Handles operations such as creating, retrieving, updating, and deleting departments.
 * Manages department-head doctor relationships and enforces business rules for department uniqueness.
 */
public interface DepartmentService {
    /**
     * Creates a new department after validating name uniqueness.
     *
     * @param createDto DTO containing department creation details
     * @return The newly created {@link Department} entity
     * @throws DepartmentAlreadyExistsException if a department with the same name already exists
     */
    Department createDepartment(DepartmentDtoCreate departmentDtoCreate);

    /**
     * Retrieves a department by its name.
     *
     * @param name Name of the department to retrieve
     * @return The found {@link Department} entity
     * @throws DepartmentNotFoundException if no department exists with the given name
     */
    Department getDepartmentByName(String name);

    /**
     * Retrieves all departments.
     *
     * @return List of all {@link Department} entities
     */
    List<Department> getAllDepartments();

    /**
     * Deletes a department by its ID.
     *
     * @param id ID of the department to delete
     * @throws DepartmentNotFoundException if no department exists with the given ID
     */
    void deleteById(Long id);

    /**
     * Retrieves a department by its ID.
     *
     * @param id ID of the department to retrieve
     * @return The found {@link Department} entity
     * @throws DepartmentNotFoundException if no department exists with the given ID
     */
    Department getDepartmentById(Long id);

    /**
     * Updates an existing department.
     * <p>
     * Validates that the department name remains unique (if changed) and assigns a head doctor if specified.
     *
     * @param id ID of the department to update
     * @param departmentUpdateDto DTO containing updated department information
     * @return The updated {@link Department} entity
     * @throws DepartmentAlreadyExistsException if another department already uses the new name
     * @throws UserNotFoundException if the specified head doctor email doesn't exist
     * @throws DepartmentNotFoundException if no department exists with the given ID
     */
    Department updateDepartment(Long id, DepartmentDtoUpdate departmentUpdateDto);
}
