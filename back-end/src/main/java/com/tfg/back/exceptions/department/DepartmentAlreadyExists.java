package com.tfg.back.exceptions.department;

public class DepartmentAlreadyExists extends RuntimeException {
    public DepartmentAlreadyExists(String name) {
        super("Department with this "+name+" Already Exists");
    }
}
