package com.tfg.back.service.impl;

import com.tfg.back.constants.Roles;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    @Value("${frontend.reset-url}")
    private String frontendResetUrl;
    private final JavaMailSender mailSender;
    private final ResourceLoader resourceLoader;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender mailSender, ResourceLoader resourceLoader) {
        this.mailSender = mailSender;
        this.resourceLoader = resourceLoader;
    }

    public void sendWelcomeEmail(String to, String name, String userType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Welcome to HospitAll!");
            helper.setFrom("no-reply@healthplus.com");

            // Get email content based on user type
            String emailContent = getEmailTemplate(name, userType);
            helper.setText(emailContent, true);

            // Add logo image (embedded)
            Resource resource = resourceLoader.getResource("classpath:static/images/logo.png");
            helper.addInline("logo", resource);

            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: " + to, e);
        }
    }

    public void sendPasswordResetEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Reset your HospitAll password");
            helper.setFrom("no-reply@healthplus.com");

            String resetUrl ="http://localhost:4200/reset-password?token=" + token;

            String html = """
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <p><a href="%s">Click here to choose a new password</a>. 
               This link is valid for 15&nbsp;minutes.</p>
            <p>If you did not request this, please ignore this e-mail.</p>
            <img src='cid:logo' style='height:60px; margin-top:20px'/>
            """.formatted(resetUrl);

            helper.setText(html, true);
            Resource logo = resourceLoader.getResource("classpath:static/images/logo.png");
            helper.addInline("logo", logo);

            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Failed to send reset-password mail to {}", to, e);
        }
    }

    public void sendAppointmentBookedEmail(String to, String name, String userType,
                                           String professionalName, String appointmentDate,
                                           String appointmentTime, String appointmentId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Appointment Confirmation - HealthPlus");
            helper.setFrom("no-reply@healthplus.com");

            String emailContent = getAppointmentBookedTemplate(name, userType, professionalName,
                    appointmentDate, appointmentTime, appointmentId);
            helper.setText(emailContent, true);

            // Add logo image (embedded)
            Resource resource = resourceLoader.getResource("classpath:static/images/logo.png");
            helper.addInline("logo", resource);

            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Failed to send appointment confirmation email to: " + to, e);
        }
    }
    private String getAppointmentBookedTemplate(String name, String userType, String professionalName,
                                                String appointmentDate, String appointmentTime,
                                                String appointmentId) {
        String header = "Appointment Scheduled!";
        String details = "";
        String instruction = "";
        String appointentsUrl = "localhost:4200/dashboard-client";
        if (Roles.CLIENT.equalsIgnoreCase(userType)) {
            details = "<p>Your appointment with <strong>Dr. " + professionalName + "</strong> has been scheduled.</p>";
            instruction = "<p>You can view or modify this appointment anytime through your dashboard.</p>";
        } else if (Roles.DOCTOR.equalsIgnoreCase(userType)) {
            details = "<p>You have a scheduled appointment with <strong>" + professionalName + "</strong>.</p>";
            instruction = "<p>Please review patient details and medical history before the appointment.</p>";
        }

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }"
                + "  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; }"
                + "  .header { background-color: #0d6efd; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }"
                + "  .content { padding: 30px; background-color: #f8f9fa; }"
                + "  .footer { padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }"
                + "  .logo { height: 60px; }"
                + "  .btn { background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }"
                + "  .card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }"
                + "  .details { margin: 10px 0; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "  <div class='header'>"
                + "    <img src='cid:logo' alt='HealthPlus Logo' class='logo'>"
                + "    <h1>" + header + "</h1>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <h2>Hello " + name + "!</h2>"
                +     details
                + "    <div class='card'>"
                + "      <div class='details'><strong>Date:</strong> " + appointmentDate + "</div>"
                + "      <div class='details'><strong>Time:</strong> " + appointmentTime + "</div>"
                + "      <div class='details'><strong>Appointment ID:</strong> " + appointmentId + "</div>"
                + "    </div>"
                +     instruction
                + "    <a href='localhost:4200/appointments' class='btn'>View Appointment Details</a>".formatted(appointentsUrl)
                + "    <p style='margin-top: 30px;'>Need to make changes? Contact support: support@healthplus.com</p>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    <p>&copy; 2025 HealthPlus. All rights reserved.</p>"
                + "    <p>123 Medical Drive, Health City, HC 54321</p>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
    private String getEmailTemplate(String name, String userType) {
        String header = "Welcome to HealthPlus!";
        String benefits = "";

        if ("client".equalsIgnoreCase(userType)) {
            benefits = "<ul>"
                    + "<li>Book appointments with top specialists</li>"
                    + "<li>Access your medical records anytime</li>"
                    + "<li>Receive personalized health insights</li>"
                    + "</ul>";
        } else if ("doctor".equalsIgnoreCase(userType)) {
            benefits = "<ul>"
                    + "<li>Manage your appointment schedule</li>"
                    + "<li>Access patient medical histories</li>"
                    + "<li>Integrated telemedicine features</li>"
                    + "</ul>";
        }

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }"
                + "  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; }"
                + "  .header { background-color: #0d6efd; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }"
                + "  .content { padding: 30px; background-color: #f8f9fa; }"
                + "  .footer { padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }"
                + "  .logo { height: 60px; }"
                + "  .btn { background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "  <div class='header'>"
                + "    <img src='cid:logo' alt='HealthPlus Logo' class='logo'>"
                + "    <h1>" + header + "</h1>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <h2>Hello " + name + "!</h2>"
                + "    <p>Thank you for joining HealthPlus, your all-in-one healthcare platform.</p>"
                + "    <p>As a " + userType + ", you now have access to:</p>"
                +     benefits
                + "    <p style='margin-top: 30px;'>Get started now:</p>"
                + "    <a href='localhost:4200' class='btn'>Access Your Dashboard</a>"
                + "    <p style='margin-top: 30px;'>Need help? Contact us at support@healthplus.com</p>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    <p>&copy; 2025 HealthPlus. All rights reserved.</p>"
                + "    <p>123 Medical Drive, Health City, HC 54321</p>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
}
