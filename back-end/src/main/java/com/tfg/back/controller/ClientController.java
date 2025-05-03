package com.tfg.back.controller;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.EmailRequest;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.client.EmergencyContactDto;
import com.tfg.back.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService){
        this.clientService = clientService;
    }

    @PostMapping("/register")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientDtoCreate client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(client));
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

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id,@Valid @RequestBody ClientDtoUpdate dto){
        Client client = clientService.updateClient(id, dto);
        return ResponseEntity.ok(client);
    }

    @DeleteMapping("/by-email")
    public ResponseEntity<Void> deleteClient(@Valid @RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        clientService.deleteClient(email);
        return ResponseEntity.noContent().build();
    }

    //FOR LATER
    @GetMapping("/emergency-contact")
    public ResponseEntity<EmergencyContactDto> getEmergencyContact(@RequestBody EmailRequest emailRequest){
        /*
        NEED TO BE IMPLEMENTED
         */
        return null;
    }

}
