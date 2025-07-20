package com.tfg.back.service.impl;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.service.PdfService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfServiceImpl implements PdfService {

    private final AppointmentService appointmentService;
    private final MedicalPrescriptionRepository medicalPrescriptionRepository;
    private String hospitalName = "HOSPITALL";

    public PdfServiceImpl(AppointmentService appointmentService, MedicalPrescriptionRepository medicalPrescriptionRepository) {
        this.appointmentService = appointmentService;
        this.medicalPrescriptionRepository = medicalPrescriptionRepository;
    }

    @Override
    public byte[] generateAppointmentPdf(Long appointmentId) {
        Appointment appointment = appointmentService.getAppointment(appointmentId);
        if (appointment == null) {
            return null;
        }

        Client client = appointment.getClient();
        Doctor doctor = appointment.getDoctor();

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(40, 40, 80, 40); // Increased top margin for header

            // ================ CONSISTENT COLOR SCHEME ================ //
            // Using the same gradient colors: #0d47a1 (dark blue) to #1976d2 (lighter blue)
            Color primaryColor = new DeviceRgb(13, 71, 161);      // #0d47a1 - Dark blue
            Color secondaryColor = new DeviceRgb(25, 118, 210);   // #1976d2 - Lighter blue
            Color lightBg = new DeviceRgb(227, 242, 253);         // Very light blue background
            Color watermarkColor = new DeviceRgb(240, 248, 255);  // Even lighter for watermark
            Color sectionColor = new DeviceRgb(13, 71, 161);      // Same as primary

            // Fonts
            PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont italic = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);

            pdfDoc.addNewPage();

            // Background watermark with updated color
            PdfCanvas canvas = new PdfCanvas(pdfDoc.getFirstPage());
            canvas.saveState()
                    .setFillColor(watermarkColor)
                    .rectangle(0, 0, pdfDoc.getDefaultPageSize().getWidth(), pdfDoc.getDefaultPageSize().getHeight())
                    .fill()
                    .restoreState();

            // Watermark text with updated color
            Paragraph watermark = new Paragraph("APPOINTMENT")
                    .setFont(bold)
                    .setFontSize(60)
                    .setFontColor(new DeviceRgb(230, 245, 255)) // Very light blue watermark
                    .setTextAlignment(TextAlignment.CENTER)
                    .setRotationAngle(Math.toRadians(45))
                    .setFixedPosition(0, 300, pdfDoc.getDefaultPageSize().getWidth());
            document.add(watermark);

            // ================ HOSPITAL HEADER (CONSISTENT WITH PRESCRIPTION PDF) ================ //
            // Hospital Header with primary color and hospital name
            Paragraph hospitalHeader = new Paragraph(hospitalName)
                    .setFont(bold)
                    .setFontSize(20)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(primaryColor)
                    .setPadding(15)
                    .setMarginBottom(5);
            document.add(hospitalHeader);

            // Secondary header for appointment
            Paragraph appointmentHeader = new Paragraph("OFFICIAL MEDICAL APPOINTMENT SUMMARY")
                    .setFont(bold)
                    .setFontSize(14)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(secondaryColor)
                    .setPadding(8)
                    .setMarginBottom(20);
            document.add(appointmentHeader);

            // ================ UPDATED HEADER TABLE ================ //
            Table headerTable = new Table(new float[]{1, 3, 1});
            headerTable.setWidth(UnitValue.createPercentValue(100));
            headerTable.setMarginBottom(20);

            // Hospital info cell (updated to use hospital name variable)
            Cell clinicCell = new Cell().setBorder(Border.NO_BORDER).setPadding(5);
            clinicCell.add(new Paragraph(hospitalName.toUpperCase())
                    .setFont(bold)
                    .setFontSize(12)
                    .setFontColor(primaryColor));
            clinicCell.add(new Paragraph("123 Calle Salah")
                    .setFont(regular)
                    .setFontSize(10));
            clinicCell.add(new Paragraph("Phone: 667-013-290")
                    .setFont(regular)
                    .setFontSize(10));

            // Title cell with updated colors
            Cell titleCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
            titleCell.add(new Paragraph("APPOINTMENT SUMMARY")
                    .setFont(bold)
                    .setFontSize(18)
                    .setFontColor(primaryColor));
            titleCell.add(new Paragraph("Official Medical Document")
                    .setFont(italic)
                    .setFontSize(10)
                    .setFontColor(secondaryColor)); // Updated to secondary color

            // ID cell with updated colors
            Cell idCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setPadding(5);
            idCell.add(new Paragraph("Apt #" + appointment.getId())
                    .setFont(bold)
                    .setFontSize(12)
                    .setFontColor(secondaryColor));
            idCell.add(new Paragraph("Generated: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                    .setFont(regular)
                    .setFontSize(9));

            headerTable.addCell(clinicCell);
            headerTable.addCell(titleCell);
            headerTable.addCell(idCell);
            document.add(headerTable);

            // ================ MAIN CONTAINER WITH CONSISTENT STYLING ================ //
            Div container = new Div()
                    .setBackgroundColor(lightBg)
                    .setBorder(new SolidBorder(primaryColor, 1))
                    .setPadding(25)
                    .setMarginBottom(30);

            // Patient and Doctor information section
            float[] columns = {1, 1};
            Table infoTable = new Table(columns);
            infoTable.setMarginBottom(20);

            // Client cell with updated styling
            Cell clientCell = new Cell()
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10)
                    .setBackgroundColor(new DeviceRgb(245, 248, 255)) // Very light blue-tinted background
                    .setBorderRight(new SolidBorder(secondaryColor, 0.5f));

            clientCell.add(new Paragraph("CLIENT INFORMATION")
                    .setFont(bold)
                    .setFontSize(11)
                    .setFontColor(sectionColor)
                    .setBorderBottom(new SolidBorder(sectionColor, 1))
                    .setMarginBottom(8));
            clientCell.add(new Paragraph(client.getFullName())
                    .setFont(bold)
                    .setFontSize(14)
                    .setMarginBottom(5));
            clientCell.add(new Paragraph("Email: " + client.getEmail())
                    .setFont(regular)
                    .setFontSize(10));
            clientCell.add(new Paragraph("Phone: " + getValueOrNA(client.getPhoneNumber()))
                    .setFont(regular)
                    .setFontSize(10));
            clientCell.add(new Paragraph("Date of Birth: " + formatDate(client.getDateOfBirth()))
                    .setFont(regular)
                    .setFontSize(10));
            clientCell.add(new Paragraph("Membership: " + String.valueOf(client.getMembershipLevel()))
                    .setFont(regular)
                    .setFontSize(10));
            clientCell.add(new Paragraph("Address: " + getValueOrNA(client.getAddress()))
                    .setFont(regular)
                    .setFontSize(10));

            // Doctor cell with updated styling
            Cell doctorCell = new Cell()
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10)
                    .setBackgroundColor(new DeviceRgb(245, 248, 255)); // Very light blue-tinted background

            doctorCell.add(new Paragraph("ATTENDING DOCTOR")
                    .setFont(bold)
                    .setFontSize(11)
                    .setFontColor(sectionColor)
                    .setBorderBottom(new SolidBorder(sectionColor, 1))
                    .setMarginBottom(8));
            doctorCell.add(new Paragraph("Dr. " + doctor.getFullName())
                    .setFont(bold)
                    .setFontSize(14)
                    .setMarginBottom(5));
            doctorCell.add(new Paragraph("Email: " + doctor.getEmail())
                    .setFont(regular)
                    .setFontSize(10));
            doctorCell.add(new Paragraph("Phone: " + getValueOrNA(doctor.getPhoneNumber()))
                    .setFont(regular)
                    .setFontSize(10));
            doctorCell.add(new Paragraph("License: " + doctor.getMedicalLicenseNumber())
                    .setFont(regular)
                    .setFontSize(10));
            doctorCell.add(new Paragraph("Specialization: " + String.valueOf(doctor.getSpecialization()))
                    .setFont(regular)
                    .setFontSize(10));
            doctorCell.add(new Paragraph("Department: " + getDepartmentName(doctor))
                    .setFont(regular)
                    .setFontSize(10));

            infoTable.addCell(clientCell);
            infoTable.addCell(doctorCell);
            container.add(infoTable);

            // ================ APPOINTMENT DETAILS SECTION ================ //
            // Add section header
            container.add(new Paragraph("Appointment Details")
                    .setFont(bold)
                    .setFontSize(13)
                    .setFontColor(sectionColor)
                    .setMarginTop(15)
                    .setMarginBottom(8)
                    .setBorderBottom(new SolidBorder(sectionColor, 1)));

            float[] detailColumns = {200f, 200f};
            Table detailsTable = new Table(detailColumns);
            detailsTable.setMarginTop(10);
            detailsTable.setMarginBottom(20);

            addMedRow(detailsTable, "Appointment ID:", appointment.getId().toString(), bold, regular);
            addMedRow(detailsTable, "Date & Time:", formatDateTime(appointment.getAppointmentDateTime()), bold, regular);
            addMedRow(detailsTable, "Status:", String.valueOf(appointment.getStatus()), bold, regular);
            addMedRow(detailsTable, "Type:", String.valueOf(appointment.getType()), bold, regular);
            addMedRow(detailsTable, "Reason:", getValueOrNA(appointment.getReason()), bold, regular);

            container.add(detailsTable);

            // Diagnosis section with updated styling
            if (appointment.getDiagnosis() != null && !appointment.getDiagnosis().isEmpty()) {
                container.add(new Paragraph("Diagnosis:")
                        .setFont(bold)
                        .setMarginTop(15)
                        .setFontColor(sectionColor)
                        .setBorderBottom(new SolidBorder(sectionColor, 1))
                        .setMarginBottom(8));
                container.add(new Paragraph(appointment.getDiagnosis())
                        .setFont(regular)
                        .setPaddingLeft(10)
                        .setBorderLeft(new SolidBorder(secondaryColor, 2)) // Thicker border with secondary color
                        .setMarginTop(5));
            }

            // Signature section with updated styling
            Div signatureDiv = new Div()
                    .setMarginTop(30)
                    .setTextAlignment(TextAlignment.RIGHT);

            signatureDiv.add(new Paragraph("_________________________")
                    .setFont(regular)
                    .setMarginBottom(5)
                    .setFontColor(primaryColor));
            signatureDiv.add(new Paragraph("Dr. " + doctor.getFullName())
                    .setFont(bold)
                    .setFontColor(primaryColor));
            signatureDiv.add(new Paragraph("License: " + doctor.getMedicalLicenseNumber())
                    .setFont(regular)
                    .setFontSize(10));

            container.add(signatureDiv);
            document.add(container);

            // Footer with hospital name and updated styling
            Paragraph footer = new Paragraph("Generated by " + hospitalName + " - This is an official medical appointment summary - For authorized use only")
                    .setFont(regular)
                    .setFontSize(8)
                    .setFontColor(primaryColor) // Using primary color instead of dark gray
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);

            document.close();

            byte[] pdfBytes = outputStream.toByteArray();
            return pdfBytes;

        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public byte[] generateMedicamentPrescriptionPdf(Long medicalPrescriptionId) {
        MedicalPrescription medicalPrescription = medicalPrescriptionRepository.findById(medicalPrescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException("Prescription not found"));

        if (!medicalPrescription.getStatus().equals(PrescriptionStatus.PUBLISHED)) {
            throw new UnauthorizedToPerformThisAction("No estas autorizado para acceder a esta prescripción");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(40, 40, 80, 40); // Increased top margin for header

            // ================ CONSISTENT COLOR SCHEME ================ //
            // Using the same gradient colors: #0d47a1 (dark blue) to #1976d2 (lighter blue)
            Color primaryColor = new DeviceRgb(13, 71, 161);      // #0d47a1 - Dark blue
            Color secondaryColor = new DeviceRgb(25, 118, 210);   // #1976d2 - Lighter blue
            Color lightBg = new DeviceRgb(227, 242, 253);         // Very light blue background
            Color watermarkColor = new DeviceRgb(240, 248, 255);  // Even lighter for watermark
            Color sectionColor = new DeviceRgb(13, 71, 161);      // Same as primary

            // Fonts
            PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont italic = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);

            pdfDoc.addNewPage();

            // Background watermark with updated color
            PdfCanvas canvas = new PdfCanvas(pdfDoc.getFirstPage());
            canvas.saveState()
                    .setFillColor(watermarkColor)
                    .rectangle(0, 0, pdfDoc.getDefaultPageSize().getWidth(), pdfDoc.getDefaultPageSize().getHeight())
                    .fill()
                    .restoreState();

            // Watermark text with updated color
            Paragraph watermark = new Paragraph("PRESCRIPTION")
                    .setFont(bold)
                    .setFontSize(60)
                    .setFontColor(new DeviceRgb(230, 245, 255)) // Very light blue watermark
                    .setTextAlignment(TextAlignment.CENTER)
                    .setRotationAngle(Math.toRadians(45))
                    .setFixedPosition(0, 300, pdfDoc.getDefaultPageSize().getWidth());
            document.add(watermark);

            // ================ HOSPITAL HEADER (CONSISTENT WITH APPOINTMENT PDF) ================ //
            // Hospital Header with primary color and hospital name
            Paragraph hospitalHeader = new Paragraph(hospitalName)
                    .setFont(bold)
                    .setFontSize(20)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(primaryColor)
                    .setPadding(15)
                    .setMarginBottom(5);
            document.add(hospitalHeader);

            // Secondary header for prescription
            Paragraph prescriptionHeader = new Paragraph("OFFICIAL MEDICAL PRESCRIPTION")
                    .setFont(bold)
                    .setFontSize(14)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(secondaryColor)
                    .setPadding(8)
                    .setMarginBottom(20);
            document.add(prescriptionHeader);

            // ================ UPDATED HEADER TABLE ================ //
            Table headerTable = new Table(new float[]{1, 3, 1});
            headerTable.setWidth(UnitValue.createPercentValue(100));
            headerTable.setMarginBottom(20);

            // Hospital info cell (updated to use hospital name variable)
            Cell clinicCell = new Cell().setBorder(Border.NO_BORDER).setPadding(5);
            clinicCell.add(new Paragraph(hospitalName.toUpperCase())
                    .setFont(bold)
                    .setFontSize(12)
                    .setFontColor(primaryColor));
            clinicCell.add(new Paragraph("123 Calle Salah")
                    .setFont(regular)
                    .setFontSize(10));
            clinicCell.add(new Paragraph("Phone: 667-013-290")
                    .setFont(regular)
                    .setFontSize(10));

            // Title cell with updated colors
            Cell titleCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
            titleCell.add(new Paragraph("MEDICAL PRESCRIPTION")
                    .setFont(bold)
                    .setFontSize(18)
                    .setFontColor(primaryColor));
            titleCell.add(new Paragraph("Valid Medical Document")
                    .setFont(italic)
                    .setFontSize(10)
                    .setFontColor(secondaryColor)); // Updated to secondary color

            // ID cell with updated colors
            Cell idCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setPadding(5);
            idCell.add(new Paragraph("Rx #" + medicalPrescription.getId())
                    .setFont(bold)
                    .setFontSize(12)
                    .setFontColor(secondaryColor));
            idCell.add(new Paragraph("Issued: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                    .setFont(regular)
                    .setFontSize(9));

            headerTable.addCell(clinicCell);
            headerTable.addCell(titleCell);
            headerTable.addCell(idCell);
            document.add(headerTable);

            // ================ MAIN CONTAINER WITH CONSISTENT STYLING ================ //
            Div container = new Div()
                    .setBackgroundColor(lightBg)
                    .setBorder(new SolidBorder(primaryColor, 1))
                    .setPadding(25)
                    .setMarginBottom(30);

            // Patient and Doctor information section
            float[] columns = {1, 1};
            Table infoTable = new Table(columns);
            infoTable.setMarginBottom(20);

            // Patient cell with updated styling
            Cell patientCell = new Cell()
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10)
                    .setBackgroundColor(new DeviceRgb(245, 248, 255)) // Very light blue-tinted background
                    .setBorderRight(new SolidBorder(secondaryColor, 0.5f));

            patientCell.add(new Paragraph("PRESCRIBED TO")
                    .setFont(bold)
                    .setFontSize(11)
                    .setFontColor(sectionColor)
                    .setBorderBottom(new SolidBorder(sectionColor, 1))
                    .setMarginBottom(8));
            patientCell.add(new Paragraph(medicalPrescription.getPrescribedTo().getFullName())
                    .setFont(bold)
                    .setFontSize(14)
                    .setMarginBottom(5));
            patientCell.add(new Paragraph("Date of Birth: " + formatDate(medicalPrescription.getPrescribedTo().getDateOfBirth()))
                    .setFont(regular)
                    .setFontSize(10));

            // Doctor cell with updated styling
            Cell doctorCell = new Cell()
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10)
                    .setBackgroundColor(new DeviceRgb(245, 248, 255)); // Very light blue-tinted background

            doctorCell.add(new Paragraph("PRESCRIBED BY")
                    .setFont(bold)
                    .setFontSize(11)
                    .setFontColor(sectionColor)
                    .setBorderBottom(new SolidBorder(sectionColor, 1))
                    .setMarginBottom(8));
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

            // ================ MEDICATION DETAILS SECTION ================ //
            // Add section header
            container.add(new Paragraph("Medication Details")
                    .setFont(bold)
                    .setFontSize(13)
                    .setFontColor(sectionColor)
                    .setMarginTop(15)
                    .setMarginBottom(8)
                    .setBorderBottom(new SolidBorder(sectionColor, 1)));

            float[] medColumns = {200f, 200f};
            Table medTable = new Table(medColumns);
            medTable.setMarginTop(10);
            medTable.setMarginBottom(20);

            addMedRow(medTable, "Medication:", medicalPrescription.getMedicationName(), bold, regular);
            addMedRow(medTable, "Dosage:", medicalPrescription.getDosage(), bold, regular);
            addMedRow(medTable, "Frequency:", medicalPrescription.getFrequency(), bold, regular);
            addMedRow(medTable, "Start Date:", formatDate(medicalPrescription.getStartDate()), bold, regular);
            addMedRow(medTable, "End Date:", formatDate(medicalPrescription.getEndDate()), bold, regular);

            container.add(medTable);

            // Additional notes with updated styling
            if (medicalPrescription.getNotes() != null && !medicalPrescription.getNotes().isEmpty()) {
                container.add(new Paragraph("Additional Instructions:")
                        .setFont(bold)
                        .setMarginTop(15)
                        .setFontColor(sectionColor)
                        .setBorderBottom(new SolidBorder(sectionColor, 1))
                        .setMarginBottom(8));
                container.add(new Paragraph(medicalPrescription.getNotes())
                        .setFont(regular)
                        .setPaddingLeft(10)
                        .setBorderLeft(new SolidBorder(secondaryColor, 2)) // Thicker border with secondary color
                        .setMarginTop(5));
            }

            // Signature section with updated styling
            Div signatureDiv = new Div()
                    .setMarginTop(30)
                    .setTextAlignment(TextAlignment.RIGHT);

            signatureDiv.add(new Paragraph("_________________________")
                    .setFont(regular)
                    .setMarginBottom(5)
                    .setFontColor(primaryColor));
            signatureDiv.add(new Paragraph("Dr. " + medicalPrescription.getPrescribedBy().getFullName())
                    .setFont(bold)
                    .setFontColor(primaryColor));
            signatureDiv.add(new Paragraph("License: " + medicalPrescription.getPrescribedBy().getMedicalLicenseNumber())
                    .setFont(regular)
                    .setFontSize(10));

            container.add(signatureDiv);
            document.add(container);

            // Footer with hospital name and updated styling
            Paragraph footer = new Paragraph("Generated by " + hospitalName + " - This is an official medical prescription - For authorized use only")
                    .setFont(regular)
                    .setFontSize(8)
                    .setFontColor(primaryColor) // Using primary color instead of dark gray
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);

            document.close();

            byte[] pdfBytes = outputStream.toByteArray();
            return pdfBytes;

        } catch (Exception e) {
            return null;
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