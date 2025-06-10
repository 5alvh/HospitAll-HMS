import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesGeneratorService {

  constructor(private httpClient: HttpClient) { }

  getAppointmentPdf(appointmentId: number): Observable<Blob> {
    const options = {
      responseType: 'blob' as 'json',
      params: new HttpParams().set('appointmentId', appointmentId.toString())
    };

    return this.httpClient.get<Blob>(`http://localhost:8080/api/pdf/appointment/${appointmentId}`, options);
  }

  getMedicalPrescriptionPdf(medicalPrescriptionId: number): Observable<Blob> {
    const options = {
      responseType: 'blob' as 'json',
      params: new HttpParams().set('medicalPrescriptionId', medicalPrescriptionId.toString())
    };

    return this.httpClient.get<Blob>(`http://localhost:8080/api/pdf/medication-prescription/${medicalPrescriptionId}`, options);
  }

}
