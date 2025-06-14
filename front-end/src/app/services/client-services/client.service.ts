import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ClientDtoGet } from '../../models/client-dto-get';
import { Router } from '@angular/router';
import { LocalStorageManagerService } from '../auth/local-storage-manager.service';
import { ClientDtoUpdate } from '../../models/client-dto-update';
import { SummaryResponse } from '../../models/summary-response';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/clients';
  private patientSource = new BehaviorSubject<ClientDtoGet>({} as ClientDtoGet);
  patient$ = this.patientSource.asObservable();
  constructor(private httpClient: HttpClient, private router: Router, private localStorageManager: LocalStorageManagerService) { }

  updateProfile(client: ClientDtoUpdate, id: number): Observable<ClientDtoGet> {
    return this.httpClient.put<ClientDtoGet>(`${this.baseUrl}/${id}`, client).pipe(
      tap((response) => this.setPatient(response)),
      catchError((error) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  getSummary(): Observable<SummaryResponse>{
    return this.httpClient.get<SummaryResponse>(`${this.baseUrl}/summary`)
  }

  getProfile(): Observable<ClientDtoGet> {
    return this.httpClient.get<ClientDtoGet>(`${this.baseUrl}/profile`).pipe(
      tap((response) => this.setPatient(response)),
      catchError((error) => {
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
        return throwError(() => "IDK WHY THIS IS AN error"); //TODO: handle error
      })
    );
  }

  inactivateAccount(): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/inactivateAccount`, null).pipe(
      tap(() => {
        this.localStorageManager.clearAuth();
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Error inactivating account:', error);
        return throwError(() => error);
      })
    );
  }

  setPatient(patient: ClientDtoGet) {
    this.patientSource.next(patient);
  }

  getPatient(): ClientDtoGet {
    return this.patientSource.getValue();
  }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/change-password`, passwords).pipe(
      catchError((error) => {
        console.error('Error changing password:', error);
        return throwError(() => error);
      })
    );
  }

  //TODO: implement this method
  getPatientDoctors(): Observable<ClientDtoGet[]> {
    return this.httpClient.get<ClientDtoGet[]>(`${this.baseUrl}/doctors`).pipe(
      catchError((error) => {
        console.error('Error fetching patient doctors:', error);
        return throwError(() => error);
      })
    );
  }
}
