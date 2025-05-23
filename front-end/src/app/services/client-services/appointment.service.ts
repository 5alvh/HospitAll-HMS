import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentCreateDto } from '../../models/appointment-dto-create';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  baseUrl = 'http://localhost:8080/appointment';
  doctorBaseUrl = 'http://localhost:8080/doctors';

  constructor(private httpClient: HttpClient) { }

  createAppointment(data: AppointmentCreateDto) {
    return this.httpClient.post(this.baseUrl, data);
  }

  getAvailableAppointments(doctorId: number, date: Date) {
    return this.httpClient.get('http://localhost:8080/appointment');
  }

  cancelAppointment(appointmentId: number) {
    return this.httpClient.put(`${this.baseUrl}/${appointmentId}/cancel`, null);
  }

  getAvailableDoctors() :Observable<{doctorFullName: string, doctorId: number}[]> {
    return this.httpClient.get<{doctorFullName: string, doctorId: number}[]>(`${this.doctorBaseUrl}/available-doctors`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/available-slots`,{params: {doctorId, date}});
  }
}
