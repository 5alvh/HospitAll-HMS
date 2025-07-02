import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { PageResponse } from '../../services/doctor-services/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  baseUrl = 'http://localhost:8080/medical-prescription'

  constructor(private httpClient: HttpClient) { }
  
  getAllPrescriptions(searchTerm: string, currentPage: number, pageSize: number): Observable<PageResponse<MedicalPrescriptionDtoGet>>{
    let params = new HttpParams()
    .set('search', searchTerm)
    .set('page', currentPage)
    .set('size', pageSize)
    return this.httpClient.get<PageResponse<MedicalPrescriptionDtoGet>>(`${this.baseUrl}/my`,{params})
  }
}
