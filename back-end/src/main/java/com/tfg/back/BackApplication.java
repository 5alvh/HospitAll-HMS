package com.tfg.back;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title = "HospitAll REST API Documentation",
				description = "HospitAll REST API Documentation",
				version = "v1",
				contact = @Contact(
						name = "Salah Eddine Khouadri",
						email = "idslhddnn@gmail.com",
						url = "https://github.com/5alvh"
				)
		)
)
public class BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}

}

//Generate documentation: BackApplication
//Controller documentation example: PdfController
//Class documentation example: AppointmentCreateDto
//Exception documentation example: Still in development