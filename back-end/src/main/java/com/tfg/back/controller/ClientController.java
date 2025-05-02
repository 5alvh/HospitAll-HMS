package com.tfg.back.controller;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.EmailRequest;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientDtoCreate client) {
        return ResponseEntity.ok(clientService.createClient(client));
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/by-email")
    public ResponseEntity<Client> getClientByEmail(@Valid @RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        Client client = clientService.getClientByEmail(email);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        if (clients.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(clients);
    }

    @DeleteMapping("/by-email")
    public ResponseEntity<Void> deleteClient(@Valid @RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        clientService.deleteClient(email);
        return ResponseEntity.noContent().build();
    }
}
