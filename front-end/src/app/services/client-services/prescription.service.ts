import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  baseUrl = 'http://localhost:8080/medical-prescription'

  constructor(private httpClient: HttpClient) { }
  
  getAllPrescriptions(): Observable<MedicalPrescriptionDtoGet[]>{
    return this.httpClient.get<MedicalPrescriptionDtoGet[]>(`${this.baseUrl}/my`)
  }
}
