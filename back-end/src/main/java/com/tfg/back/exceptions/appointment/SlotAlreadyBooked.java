package com.tfg.back.exceptions.appointment;

public class SlotAlreadyBooked extends RuntimeException {
    public SlotAlreadyBooked(String message) {
        super(message);
    }
}
