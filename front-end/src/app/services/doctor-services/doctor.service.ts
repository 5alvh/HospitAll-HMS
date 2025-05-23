import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  baseUrl = 'http://localhost:8080/doctors';
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
}
