package com.tfg.back.service;

import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Client;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.client.SummaryResponse;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;

import java.util.List;

public interface ClientService {

    SummaryResponse getClientSummaryByEmail(String email);

    /**
     * Get All Clients {@link List<ClientDtoGet>}
     * Returns a list of all clients.
     *
     * @return List<ClientDtoGet> a list of all clients
     */
    List<ClientDtoGet> getAllClients();
    /**
     * Get Client by ID {@link ClientDtoGet}
     * Returns a client with the specified ID.
     *
     * @param id the ID of the client to retrieve
     * @return ClientDtoGet the client with the specified ID
     */
    ClientDtoGet getClientById(Long id);

    /**
     * Get Client by Email {@link ClientDtoGet}
     * Returns a client with the specified email address.
     *
     * @param email the email address of the client to retrieve
     * @return ClientDtoGet the client with the specified email
     */
    ClientDtoGet getClientByEmail(String email);
    /**
     * Create a new Client {@link ClientDtoGet}
     * Creates and saves a new client after validating passwords and email uniqueness.
     *
     * @param clientDto the client data to create
     * @return ClientDtoGet the newly created client
     */
    ClientDtoGet createClient(ClientDtoCreate clientDto);

    /**
     * Update an existing Client {@link ClientDtoGet}
     * Updates and saves an existing client with the provided data.
     *
     * @param id the ID of the client to update
     * @param clientDto the updated client data
     * @return ClientDtoGet the updated client
     */
    ClientDtoGet updateClient(Long id, ClientDtoUpdate clientDto);

    /**
     * Change Client Password
     * Updates a client's password after validation.
     *
     * @param email the email of the client whose password will be changed
     * @param newPassword the new password information
     */
    void changePassword(String email, ChangePasswordRequest newPassword);

    /**
     * Delete a Client
     * Deletes the client with the specified email address.
     *
     * @param email the email of the client to delete
     */
    void deleteClient(String email);

    /**
     * Activate a Client
     * Sets the client's status to ACTIVE.
     *
     * @param email the email of the client to activate
     */
    void activateClient(String email);

    /**
     * Inactivate a Client
     * Sets the client's status to INACTIVE.
     *
     * @param email the email of the client to inactivate
     */
    void inactivateClient(String email);

    /**
     * Suspend a Client
     * Sets the client's status to SUSPENDED.
     *
     * @param email the email of the client to suspend
     */
    void suspendClient(String email);

    /**
     * Get Client Notifications {@link List<Notification>}
     * Returns all notifications for the specified client.
     *
     * @param email the email of the client whose notifications to retrieve
     * @return List<Notification> the client's notifications
     */
    List<Notification> getClientsNotifications(String email);

    /**
     * Get Client Appointments {@link List<AppointmentDtoGet>}
     * Returns all appointments for the specified client.
     *
     * @param email the email of the client whose appointments to retrieve
     * @return List<AppointmentDtoGet> the client's appointments
     */
    List<AppointmentDtoGet> getAppointmentsByClientEmail(String email);

    /**
     * Finds a {@link Client} by their email address.
     *
     * <p>This method is intended for internal service-to-service use.
     * Throws an exception if the email is null, blank, or if no user is found.</p>
     *
     * @param email the email address of the client to find
     * @return the matching {@link Client}
     * @throws IllegalArgumentException if the email is null or blank
     * @throws UserNotFoundException if no client is found with the given email
     */
    Client findClientByEmail(String email);

}
