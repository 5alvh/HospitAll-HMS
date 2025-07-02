import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ClientDtoGet } from '../../models/client-dto-get';
import { VisitedDoctorDto } from '../../client/components/dashboard/dashboard-client.component';
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  baseUrl = 'http://localhost:8080/doctors';
  baseUrlForAppointments = 'http://localhost:8080/appointment';
  baseUrlMedicalPrescriptions = 'http://localhost:8080/medical-prescription';
  constructor(private httpClient: HttpClient, private router: Router) { }

  getPatients(search: string = '', page: number = 0, size: number = 10): Observable<PageResponse<ClientDtoGet>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get<PageResponse<ClientDtoGet>>('http://localhost:8080/clients/clients', { params });
  }

  getSummary(): Observable<{todayAppointments:any[],pendingPrescriptions: number, totalPatients: number, averageRating: number}>{
    return this.httpClient.get<{todayAppointments:any[],pendingPrescriptions: number, totalPatients: number, averageRating: number}>(`${this.baseUrl}/summary`)
  }
  getPatientById(id:number): Observable<any> {

    return this.httpClient.get<any>(`http://localhost:8080/clients/details/${id}`);
  }

  getMyFeedback(): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:8080/feedback/doctor/my`)
  }
  getMedicalPrescriptions(page: number, size: number, search: string): Observable<PageResponse<any>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search)
    return this.httpClient.get<PageResponse<any>>(`${this.baseUrlMedicalPrescriptions}/doctor/my`, { params })
  }
  updatePrescription(doctor: any) {
    return this.httpClient.put(`${this.baseUrlMedicalPrescriptions}/update`, doctor).pipe(
      catchError((error) => {
        console.error('Error updating prescription:', error);
        return throwError(() => error);
      })
    );
  }

  getAllDoctors() {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/change-password`, passwords).pipe(
      catchError((error) => {
        console.error('Error changing password:', error);
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<DoctorDtoGet> {
    return this.httpClient.get<DoctorDtoGet>(`${this.baseUrl}/profile`).pipe(
      tap((response) => {
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
    return this.httpClient.get<VisitedDoctorDto[]>(`${this.baseUrl}/get-doctors`).pipe(
      catchError((error) => {
        console.error('Error fetching visited doctors:', error);
        return throwError(() => new Error('Failed to fetch visited doctors'));
      })
    );
  }

  getNumberOfPatientsByDoctorId(doctorId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrlForAppointments}/doctor/patients/count`).pipe(
      catchError((error) => {
        console.error('Error fetching number of patients:', error);
        return throwError(() => new Error('Failed to fetch number of patients'));
      })
    );
  }

  confirmAppointment(appointmentId: number): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrlForAppointments}/${appointmentId}/confirm`, {}).pipe(
      catchError((error) => {
        console.error('Error confirming appointment:', error);
        return throwError(() => new Error('Failed to confirm appointment'));
      })
    );
  }

  completeAppointment(appointmentId: number): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrlForAppointments}/${appointmentId}/complete`, {}).pipe(
      catchError((error) => {
        console.error('Error confirming appointment:', error);
        return throwError(() => new Error('Failed to confirm appointment'));
      })
    );
  }

  createPrescription(prescription: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrlMedicalPrescriptions}`, prescription).pipe(
      catchError((error) => {
        console.error('Error creating prescription:', error);
        return throwError(() => new Error('Failed to create prescription'));
      })
    );
  }

  publishPrescription(id: number) {
    return this.httpClient.patch<any>(`${this.baseUrlMedicalPrescriptions}/${id}/publish`, {}).pipe(
      catchError((error) => {
        console.error('Error publishing prescription:', error);
        return throwError(() => new Error('Failed to publish prescription'));
      })
    )
  }
  updateProfile(client: any, id: number): Observable<ClientDtoGet> {
    return this.httpClient.put<ClientDtoGet>(`${this.baseUrl}/${id}`, client).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  deletePrescription(prescriptionId: number) {
    return this.httpClient.delete(`${this.baseUrlMedicalPrescriptions}/${prescriptionId}`).pipe(
      catchError((error) => {
        console.error('Error deleting prescription:', error);
        return throwError(() => error);
      })
    );
  }
}
