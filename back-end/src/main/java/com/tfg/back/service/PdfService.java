package com.tfg.back.service;

public interface PdfService {

    byte[] generateAppointmentPdf(Long id);
    byte[] generateMedicamentPrescriptionPdf(Long id);
}
