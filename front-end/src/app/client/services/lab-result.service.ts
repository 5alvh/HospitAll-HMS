import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';
import { environment } from '../../../environments/environment.development';
import { PageResponse } from '../../services/doctor-services/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class LabResultService {

  labResultUrl = `${environment.baseUrl}/lab-results`

  constructor(private httpClient: HttpClient) { }

  getAllLabResults(currentPage: number, pageSize: number): Observable<PageResponse<LabResultDtoGet>>{
    let params= new HttpParams()
    .set('size', pageSize)
    .set('page', currentPage)
    return this.httpClient.get<PageResponse<LabResultDtoGet>>(`${this.labResultUrl}/my`,{params})
  }

}
