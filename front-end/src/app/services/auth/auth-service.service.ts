import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDtoCreate } from '../../models/client-dto-create';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrlClients = 'http://localhost:8080/clients';
  private baseUrlDoctors = 'http://localhost:8080/doctors';
  constructor(private httpClient: HttpClient) { }

  registerClient(data: ClientDtoCreate) {
    return this.httpClient.post(`${this.baseUrlClients}/register`, data);
  }

  registerDoctor(data: ClientDtoCreate) {
    return this.httpClient.post(`${this.baseUrlDoctors}/register`, data);
  }
}
