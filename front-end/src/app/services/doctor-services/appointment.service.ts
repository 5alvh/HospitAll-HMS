import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from './doctor.service';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = 'http://localhost:8080/appointment';

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/doctor/my`);
  }

  getAllAppointmentsPaged(page: number, size: number, status: string, includeCancelled: boolean, before?: Date, after?: Date): Observable<PageResponse<AppointmentDtoGet>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('includeCancelled', includeCancelled)
    if (before) {
      params = params.set('before', before.toISOString());
    }

    if (after) {
      params = params.set('after', after.toISOString());
    }

    if (status !== 'all') {
      params = params.append('filter', status);
    }
    return this.http.get<PageResponse<AppointmentDtoGet>>(`${this.baseUrl}/doctor/my/pageable`, { params });
  }

  giveDiagnosis(appointmentId: number, diagnosis: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/diagnosis`, { diagnosis, appointmentId });
  }
}
