import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentCreateDto } from '../../models/appointment-dto-create';
import { Observable } from 'rxjs';
import { BookAppRequest } from '../../doctor/doctor-dashboard/doctor-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  baseUrl = 'http://localhost:8080/appointment';
  doctorBaseUrl = 'http://localhost:8080/doctors';

  constructor(private httpClient: HttpClient) { }

  bookAppointment(appointment: AppointmentCreateDto): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/book-appointment`, appointment);
  }

  getAvailableDoctors(departmentId: number, date: number): Observable<{ doctorFullName: string, doctorId: number }[]> {
    return this.httpClient.post<{ doctorFullName: string, doctorId: number }[]>(
      `${this.doctorBaseUrl}/available-doctors`,
      { departmentId, date }
    );
  }

  getAvailableSlots(doctorId: number, date: Date): Observable<{ id: number, startTime: string, endTime: string }[]> {
    return this.httpClient.post<any>(`${this.doctorBaseUrl}/available-slots`, { doctorId, date });
  }

  cancelAppointment(appointmentId: number) {
    return this.httpClient.put(`${this.baseUrl}/${appointmentId}/cancel`, null);
  }

  bookAppobookAppointmentByDoctorUsingClientEmail(appointment: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/book-appointment-doctor/client-email`, appointment);
  }

  bookAppointmentByDoctorUsingClientId(appointment: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/book-appointment-doctor/client-id`, appointment);
  }

  giveDiagnosis(appointmentId: number, diagnosis: string) : Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/diagnosis`, { diagnosis, appointmentId });
  }

}
