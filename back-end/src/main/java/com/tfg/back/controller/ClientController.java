package com.tfg.back.controller;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientDtoCreate client) {
        return ResponseEntity.ok(clientService.createClient(client));
    }

    @GetMapping("id/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return null;
        //return clientService.getClient(id)
        //        .map(ResponseEntity::ok)
        //        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("email/{email}")
    public ResponseEntity<Client> getClientByEmail(@PathVariable String email) {
        return ResponseEntity.ok(clientService.getClientByEmail(email));
        //return clientService.getClient(id)
        //        .map(ResponseEntity::ok)
        //        .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
