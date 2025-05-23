package com.tfg.back.controller;

import com.tfg.back.model.Client;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.service.ClientService;
import com.tfg.back.utils.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService){
        this.clientService = clientService;
    }

    @PostMapping("/register")
    public ResponseEntity<ClientDtoGet> createClient(@Valid @RequestBody ClientDtoCreate client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(client));
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<ClientDtoGet> getClientById(@PathVariable Long id) {
        ClientDtoGet client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/profile")
    public ResponseEntity<ClientDtoGet> getClientByEmail(Authentication authentication) {
        String email = authentication.getName();
        ClientDtoGet client = clientService.getClientByEmail(email);
        return ResponseEntity.ok(client);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication authentication, @RequestBody ChangePasswordRequest newPassword) {
        String email = authentication.getName();
        clientService.changePassword(email, newPassword);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/all")
    public ResponseEntity<List<ClientDtoGet>> getAllClients() {
        List<ClientDtoGet> clients = clientService.getAllClients();
        if (clients.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(clients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDtoGet> updateClient(@PathVariable Long id,@Valid @RequestBody ClientDtoUpdate dto){
        ClientDtoGet client = clientService.updateClient(id, dto);
        return ResponseEntity.ok(client);
    }

    @DeleteMapping("/by-email")
    public ResponseEntity<Void> deleteClient(Authentication authentication) {
        String email = authentication.getName();
        clientService.deleteClient(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDtoGet>> getAppointmentsByClientEmail(Authentication authentication) {
        String email = authentication.getName();
        List<AppointmentDtoGet> clients = clientService.getAppointmentsByClientEmail(email);
        return ResponseEntity.ok(clients);
    }

    @PutMapping("/inactivateAccount")
    public ResponseEntity<Void> inactivateAccount(Authentication authentication) {
        String email = authentication.getName();
        clientService.inactivateClient(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-notifications")
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        List<Notification> notifications = clientService.getClientsNotifications(email);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/activate-account")
    public ResponseEntity<Void> activateAccount(Authentication authentication) {
        String email = authentication.getName();
        clientService.activateClient(email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("suspend-account")
    public ResponseEntity<Void> suspendAccount(Authentication authentication) {
        String email = authentication.getName();
        clientService.suspendClient(email);
        return ResponseEntity.noContent().build();
    }
}
