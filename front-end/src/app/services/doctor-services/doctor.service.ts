import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { VisitedDoctorDto } from '../../client/client-dashboard/dashboard-client.component';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  baseUrl = 'http://localhost:8080/doctors';
  baseUrlForAppointments = 'http://localhost:8080/appointment';
  constructor(private httpClient: HttpClient, private router: Router) { }

  getAllDoctors() {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  getProfile(): Observable<DoctorDtoGet> {
    return this.httpClient.get<DoctorDtoGet>(`${this.baseUrl}/profile`).pipe(
      tap((response) => {
        // Handle the response here if needed
        console.log('Doctor profile:', response);
      }),
      catchError((error) => {
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
        return throwError(() => "IDK WHY THIS IS AN error"); 
      })
    );
  }

  getAllDoctorsBySpecialty(specialty: string): Observable<DoctorDtoGet[]> {
    return this.httpClient.get<DoctorDtoGet[]>(`${this.baseUrl}/specialty/${specialty}`);
  }

  getVisitedDoctorByClientId(clientId: number): Observable<VisitedDoctorDto[]> {
    return this.httpClient.get<VisitedDoctorDto[]>(`${this.baseUrl}/get-doctors/${clientId}`).pipe(
      catchError((error) => {
        console.error('Error fetching visited doctors:', error);
        return throwError(() => new Error('Failed to fetch visited doctors'));
      })
    );
  }

  getNumberOfPatientsByDoctorId(doctorId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrlForAppointments}/total-patients/${doctorId}`).pipe(
      catchError((error) => {
        console.error('Error fetching number of patients:', error);
        return throwError(() => new Error('Failed to fetch number of patients'));
      })
    );
  }
}
