package com.tfg.back.annotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class ListSizeValidator implements ConstraintValidator<ListSize, List<?>> {
    private int size;

    @Override
    public void initialize(ListSize constraintAnnotation) {
        this.size = constraintAnnotation.value();
    }

    @Override
    public boolean isValid(List<?> list, ConstraintValidatorContext context) {
        return list != null && list.size() == size;
    }
}
