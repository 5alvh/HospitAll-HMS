package com.tfg.back.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ListSizeValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ListSize {
    String message() default "List must contain exactly {value} elements";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    int value();
}