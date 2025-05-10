import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentCreateDto } from '../../models/appointment-dto-create';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private httpClient: HttpClient) { }

  createAppointment(data: AppointmentCreateDto) {
    return this.httpClient.post('http://localhost:8080/appointment', data);
  }

  getAvailableAppointments(doctorId: number, date: Date) {
    return this.httpClient.get('http://localhost:8080/appointment');
  }
}
