package com.tfg.back.controller;

import com.itextpdf.layout.properties.TextAlignment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/pdf")
@Tag(name = "Apis to generate pdfs",
    description = "Apis to generate pdfs and return them to the user for download")
public class PdfController {

    @Operation(
            summary = "Generates an appointment pdf",
            description = "Generates an appointment pdf and returns it to the user for download"
    )

    @ApiResponse(
            responseCode = "200",
            description = "Returns the generated pdf"
    )
    @GetMapping("/appointment")
    public ResponseEntity<byte[]> generateAppointmentPdf() {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            var font = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            Paragraph title = new Paragraph("Appointment Details")
                    .setFont(font)
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);

            document.add(title);

            document.add(new Paragraph("Appointment ID: 33"));
            document.add(new Paragraph("Client: Test_User"));
            document.add(new Paragraph("Date & Time: May 27, 2025"));
            document.add(new Paragraph("Reason: 1234578lkñ"));
            document.add(new Paragraph("Status: CONFIRMED"));
            document.add(new Paragraph("Type: IN_PERSON"));

            document.close();

            byte[] pdfBytes = outputStream.toByteArray();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointment.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
