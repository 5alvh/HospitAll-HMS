package com.tfg.back.exceptions.department;

public class DepartmentAlreadyExistsException extends RuntimeException {
    public DepartmentAlreadyExistsException(String name) {
        super("Department with this "+name+" Already Exists");
    }
}
