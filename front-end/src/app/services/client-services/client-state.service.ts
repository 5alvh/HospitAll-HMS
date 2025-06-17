import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientStateService {

  fullNameSubject= new BehaviorSubject<string>('404');
  fullName$ = this.fullNameSubject.asObservable()

  setFullName(fullName: string){
    this.fullNameSubject.next(fullName)
  }
}
