package com.tfg.back.controller;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.service.MedicalPrescriptionService;
import com.tfg.back.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/pdf")
@AllArgsConstructor
@Tag(name = "Apis to generate pdfs",
    description = "Apis to generate pdfs and return them to the user for download")
public class PdfController {


    private PdfService pdfService;
    private final AppointmentService appointmentService;
    private final MedicalPrescriptionRepository medicalPrescriptionRepository;

    @Operation(
            summary = "Generates an appointment pdf",
            description = "Generates an appointment pdf and returns it to the user for download"
    )

    @ApiResponse(
            responseCode = "200",
            description = "Returns the generated pdf"
    )
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<byte[]> generateAppointmentPdf(@PathVariable Long appointmentId) {
        byte[] pdfBytes = pdfService.generateAppointmentPdf(appointmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointment_summary_" + appointmentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/medication-prescription/{medicalPrescriptionId}")
    public ResponseEntity<byte[]> generateMedicamentPrescriptionPdf(@PathVariable Long medicalPrescriptionId) {

        byte[] pdfBytes = pdfService.generateMedicamentPrescriptionPdf(medicalPrescriptionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medication_prescription_" + medicalPrescriptionId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    private void addMedRow(Table table, String label, String value, PdfFont labelFont, PdfFont valueFont) {
        Cell labelCell = new Cell().add(new Paragraph(label).setFont(labelFont).setBorder(Border.NO_BORDER));
        Cell valueCell = new Cell().add(new Paragraph(value).setFont(valueFont).setBorder(Border.NO_BORDER));
        table.addCell(labelCell);
        table.addCell(valueCell);
    }


    private Paragraph createStyledSection(String text, PdfFont font, Color color) {
        return new Paragraph(text)
                .setFont(font)
                .setFontSize(13)
                .setFontColor(color)
                .setMarginBottom(8)
                .setBorderBottom(new SolidBorder(color, 1));
    }

    private void addTableRow(Table table, String label, String value, PdfFont labelFont, PdfFont valueFont) {
        table.addCell(new Cell().add(new Paragraph(label).setFont(labelFont)));
        table.addCell(new Cell().add(new Paragraph(value).setFont(valueFont)));
    }

    private Paragraph createInfoParagraph(String label, String value, PdfFont labelFont, PdfFont valueFont) {
        return new Paragraph()
                .add(new Text(label).setFont(labelFont))
                .add(new Text(value).setFont(valueFont))
                .setMarginBottom(5);
    }

    private String getValueOrNA(String value) {
        return (value != null && !value.isEmpty()) ? value : "N/A";
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null
                ? dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"))
                : "N/A";
    }

    private String formatDate(LocalDate date) {
        return date != null
                ? date.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
                : "N/A";
    }

    private String getDepartmentName(Doctor doctor) {
        return (doctor.getDepartment() != null) ? doctor.getDepartment().getName() : "N/A";
    }
}
