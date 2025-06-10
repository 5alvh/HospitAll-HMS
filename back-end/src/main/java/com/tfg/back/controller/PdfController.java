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
        Appointment appointment = appointmentService.getAppointment(appointmentId);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        Client client = appointment.getClient();
        Doctor doctor = appointment.getDoctor();

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(40, 40, 80, 40); // Increased top margin for header

            // ================ STYLING IMPROVEMENTS ================ //
            // Color Scheme
            Color accentColor = new DeviceRgb(59, 89, 152);   // Professional blue
            Color lightBg = new DeviceRgb(240, 244, 249);     // Light background
            Color sectionColor = new DeviceRgb(41, 128, 185); // Section blue

            // Fonts (Using embedded fonts for better typography)
            PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont sectionFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Header with styling
            Paragraph header = new Paragraph("MEDICAL APPOINTMENT SUMMARY")
                    .setFont(titleFont)
                    .setFontSize(16)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(accentColor)
                    .setPadding(10)
                    .setMarginBottom(20);
            document.add(header);

            // Main content container
            Div contentDiv = new Div()
                    .setPadding(20)
                    .setBackgroundColor(lightBg)
                    .setBorder(new SolidBorder(accentColor, 1))
                    .setMarginBottom(20);

            // Title with accent color
            contentDiv.add(new Paragraph("Appointment Summary")
                    .setFont(titleFont)
                    .setFontSize(18)
                    .setFontColor(accentColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(15));

            // ================ APPOINTMENT DETAILS ================ //
            contentDiv.add(createStyledSection("Appointment Details", sectionFont, sectionColor));

            // Use two-column layout for better information density
            float[] columnWidths = {200f, 200f};
            Table detailsTable = new Table(columnWidths);
            detailsTable.setMarginBottom(10);

            addTableRow(detailsTable, "ID:", appointment.getId().toString(), boldFont, regularFont);
            addTableRow(detailsTable, "Date & Time:", formatDateTime(appointment.getAppointmentDateTime()), boldFont, regularFont);
            addTableRow(detailsTable, "Status:", String.valueOf(appointment.getStatus()), boldFont, regularFont);
            addTableRow(detailsTable, "Type:", String.valueOf(appointment.getType()), boldFont, regularFont);
            addTableRow(detailsTable, "Reason:", getValueOrNA(appointment.getReason()), boldFont, regularFont);
            addTableRow(detailsTable, "Diagnosis:", getValueOrNA(appointment.getDiagnosis()), boldFont, regularFont);

            contentDiv.add(detailsTable);

            // ================ PERSONAL INFORMATION ================ //
            // Client and Doctor side-by-side
            float[] infoWidths = {1, 1}; // Equal width columns
            Table personalInfoTable = new Table(infoWidths);

            // Client Info
            Cell clientCell = new Cell()
                    .setPadding(10)
                    .setBackgroundColor(new DeviceRgb(249, 249, 249))
                    .setBorderRight(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));

            clientCell.add(createStyledSection("Client Information", sectionFont, sectionColor));
            clientCell.add(createInfoParagraph("Name:", client.getFullName(), boldFont, regularFont));
            clientCell.add(createInfoParagraph("Email:", client.getEmail(), boldFont, regularFont));
            clientCell.add(createInfoParagraph("Phone:", getValueOrNA(client.getPhoneNumber()), boldFont, regularFont));
            clientCell.add(createInfoParagraph("DOB:", formatDate(client.getDateOfBirth()), boldFont, regularFont));
            clientCell.add(createInfoParagraph("Membership:", String.valueOf(client.getMembershipLevel()), boldFont, regularFont));
            clientCell.add(createInfoParagraph("Address:", getValueOrNA(client.getAddress()), boldFont, regularFont));

            // Doctor Info
            Cell doctorCell = new Cell().setPadding(10);
            doctorCell.add(createStyledSection("Doctor Information", sectionFont, sectionColor));
            doctorCell.add(createInfoParagraph("Name:", doctor.getFullName(), boldFont, regularFont));
            doctorCell.add(createInfoParagraph("Email:", doctor.getEmail(), boldFont, regularFont));
            doctorCell.add(createInfoParagraph("Phone:", getValueOrNA(doctor.getPhoneNumber()), boldFont, regularFont));
            doctorCell.add(createInfoParagraph("License #:", doctor.getMedicalLicenseNumber(), boldFont, regularFont));
            doctorCell.add(createInfoParagraph("Specialization:", String.valueOf(doctor.getSpecialization()), boldFont, regularFont));
            doctorCell.add(createInfoParagraph("Department:", getDepartmentName(doctor), boldFont, regularFont));

            personalInfoTable.addCell(clientCell);
            personalInfoTable.addCell(doctorCell);
            contentDiv.add(personalInfoTable);

            document.add(contentDiv);

            // Footer with generation timestamp
            Paragraph footer = new Paragraph("Generated on " + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .setFont(regularFont)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);

            document.close();

            byte[] pdfBytes = outputStream.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointment_summary_" + appointmentId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            //log.error("PDF generation failed for appointment {}", appointmentId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/medication-prescription/{medicalPrescriptionId}")
    public ResponseEntity<byte[]> generateMedicamentPrescriptionPdf(@PathVariable Long medicalPrescriptionId) {
        MedicalPrescription medicalPrescription = medicalPrescriptionRepository.findById(medicalPrescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException("Prescription not found"));

        if (!medicalPrescription.getStatus().equals(PrescriptionStatus.PUBLISHED)) {
            throw new UnauthorizedToPerformThisAction("No estas autorizado para acceder a esta prescripción");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(40, 40, 80, 40); // Increased top margin for header

            Color primaryColor = new DeviceRgb(0, 102, 153);    // Deep blue for medical
            Color secondaryColor = new DeviceRgb(0, 150, 136);  // Teal for accents
            Color watermarkColor = new DeviceRgb(230, 245, 255); // Light watermark
            Color lightBg = new DeviceRgb(250, 252, 254);        // Very light background

            PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont italic = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);
            pdfDoc.addNewPage();

            PdfCanvas canvas = new PdfCanvas(pdfDoc.getFirstPage());
            canvas.saveState()
                    .setFillColor(watermarkColor)
                    .rectangle(0, 0, pdfDoc.getDefaultPageSize().getWidth(), pdfDoc.getDefaultPageSize().getHeight())
                    .fill()
                    .restoreState();

            Paragraph watermark = new Paragraph("PRESCRIPTION")
                    .setFont(bold)
                    .setFontSize(60)
                    .setFontColor(new DeviceRgb(220, 240, 255))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setRotationAngle(Math.toRadians(45))
                    .setFixedPosition(0, 300, pdfDoc.getDefaultPageSize().getWidth());
            document.add(watermark);

            Table headerTable = new Table(new float[]{1, 3, 1});
            headerTable.setWidth(UnitValue.createPercentValue(100));
            headerTable.setMarginBottom(20);

            Cell clinicCell = new Cell().setBorder(Border.NO_BORDER).setPadding(5);
            clinicCell.add(new Paragraph("MEDICAL CENTER")
                    .setFont(bold)
                    .setFontSize(12));
            clinicCell.add(new Paragraph("123 Health Street")
                    .setFont(regular)
                    .setFontSize(10));
            clinicCell.add(new Paragraph("Phone: (555) 123-4567")
                    .setFont(regular)
                    .setFontSize(10));

            Cell titleCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
            titleCell.add(new Paragraph("OFFICIAL PRESCRIPTION")
                    .setFont(bold)
                    .setFontSize(18)
                    .setFontColor(primaryColor));
            titleCell.add(new Paragraph("Valid Medical Document")
                    .setFont(italic)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.DARK_GRAY));

            Cell idCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setPadding(5);
            idCell.add(new Paragraph("Rx #" + medicalPrescription.getId())
                    .setFont(bold)
                    .setFontSize(12)
                    .setFontColor(secondaryColor));
            idCell.add(new Paragraph("Issued: " + LocalDate.now().format(DateTimeFormatter.ISO_DATE))
                    .setFont(regular)
                    .setFontSize(9));

            headerTable.addCell(clinicCell);
            headerTable.addCell(titleCell);
            headerTable.addCell(idCell);
            document.add(headerTable);

            Div container = new Div()
                    .setBackgroundColor(lightBg)
                    .setBorder(new SolidBorder(primaryColor, 1))
                    .setPadding(25)
                    .setMarginBottom(30);

            float[] columns = {1, 1};
            Table infoTable = new Table(columns);
            infoTable.setMarginBottom(20);

            Cell patientCell = new Cell().setBorder(Border.NO_BORDER);
            patientCell.add(new Paragraph("PRESCRIBED TO").setFont(bold).setFontSize(11).setFontColor(secondaryColor));
            patientCell.add(new Paragraph(medicalPrescription.getPrescribedTo().getFullName())
                    .setFont(bold)
                    .setFontSize(14)
                    .setMarginBottom(5));
            patientCell.add(new Paragraph("Date of Birth: " + formatDate(medicalPrescription.getPrescribedTo().getDateOfBirth()))
                    .setFont(regular)
                    .setFontSize(10));

            Cell doctorCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
            doctorCell.add(new Paragraph("PRESCRIBED BY").setFont(bold).setFontSize(11).setFontColor(secondaryColor));
            doctorCell.add(new Paragraph("Dr. " + medicalPrescription.getPrescribedBy().getFullName())
                    .setFont(bold)
                    .setFontSize(14)
                    .setMarginBottom(5));
            doctorCell.add(new Paragraph("License: " + medicalPrescription.getPrescribedBy().getMedicalLicenseNumber())
                    .setFont(regular)
                    .setFontSize(10));
            doctorCell.add(new Paragraph(String.valueOf(medicalPrescription.getPrescribedBy().getSpecialization()))
                    .setFont(regular)
                    .setFontSize(10));

            infoTable.addCell(patientCell);
            infoTable.addCell(doctorCell);
            container.add(infoTable);

            float[] medColumns = {30, 70};
            Table medTable = new Table(medColumns);
            medTable.setMarginTop(15);
            medTable.setMarginBottom(20);

            addMedRow(medTable, "Medication:", medicalPrescription.getMedicationName(), bold, regular);
            addMedRow(medTable, "Dosage:", medicalPrescription.getDosage(), bold, regular);
            addMedRow(medTable, "Frequency:", medicalPrescription.getFrequency(), bold, regular);
            addMedRow(medTable, "Start Date:", formatDate(medicalPrescription.getStartDate()), bold, regular);
            addMedRow(medTable, "End Date:", formatDate(medicalPrescription.getEndDate()), bold, regular);

            container.add(medTable);

            // Additional notes
            if (medicalPrescription.getNotes() != null && !medicalPrescription.getNotes().isEmpty()) {
                container.add(new Paragraph("Additional Instructions:")
                        .setFont(bold)
                        .setMarginTop(15)
                        .setFontColor(secondaryColor));
                container.add(new Paragraph(medicalPrescription.getNotes())
                        .setFont(regular)
                        .setPaddingLeft(10)
                        .setBorderLeft(new SolidBorder(secondaryColor, 1))
                        .setMarginTop(5));
            }

            Div signatureDiv = new Div()
                    .setMarginTop(30)
                    .setTextAlignment(TextAlignment.RIGHT);

            signatureDiv.add(new Paragraph("_________________________")
                    .setFont(regular)
                    .setMarginBottom(5));
            signatureDiv.add(new Paragraph("Dr. " + medicalPrescription.getPrescribedBy().getFullName())
                    .setFont(bold));
            signatureDiv.add(new Paragraph("License: " + medicalPrescription.getPrescribedBy().getMedicalLicenseNumber())
                    .setFont(regular)
                    .setFontSize(10));

            container.add(signatureDiv);
            document.add(container);

            Paragraph footer = new Paragraph("This is an official medical prescription - For authorized use only")
                    .setFont(regular)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);

            document.close();

            byte[] pdfBytes = outputStream.toByteArray();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prescription-" + medicalPrescription.getId() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
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
