import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentCreateDto } from '../../models/appointment-dto-create';
import { Observable } from 'rxjs';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { PageResponse } from '../../services/doctor-services/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  baseUrl = 'http://localhost:8080/appointment';
  doctorBaseUrl = 'http://localhost:8080/doctors';

  constructor(private httpClient: HttpClient) { }

  bookAppointment(appointment: AppointmentCreateDto): Observable<AppointmentDtoGet> {
    return this.httpClient.post<any>(`${this.baseUrl}`, appointment);
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
    return this.httpClient.post<any>(`${this.baseUrl}/doctor/email`, appointment);
  }

  bookAppointmentByDoctorUsingClientId(appointment: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/doctor/id`, appointment);
  }

  getAllAppointments(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/patient/my`);
  }

  getUpcommingAppointments(size: number, page: number, hideCancelled: boolean): Observable<PageResponse<AppointmentDtoGet>> {
    let params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('includeCancelled', hideCancelled)
    return this.httpClient.get<PageResponse<AppointmentDtoGet>>(`${this.baseUrl}/patient/my/upComing`,{params});
  }
  getAppointmentsHistory(size: number, page: number): Observable<PageResponse<AppointmentDtoGet>> {
    let params = new HttpParams()
      .set('size', size)
      .set('page', page)
    return this.httpClient.get<PageResponse<AppointmentDtoGet>>(`${this.baseUrl}/patient/my/history`, { params });
  }
}
