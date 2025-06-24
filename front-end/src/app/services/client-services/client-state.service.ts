import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientStateService {

  fullNameSubject= new BehaviorSubject<{fullName: string}>({fullName:'Hola'});
  fullName$ = this.fullNameSubject.asObservable()
  clientService = inject(ClientService);
  
  setFullName(fullName: string){
    this.fullNameSubject.next({fullName: fullName})
  }

  getFullName(){
    return this.clientService.getFullName().subscribe(
      (response)=>{
          this.setFullName(response.fullName)
      }
    )
  }
}
