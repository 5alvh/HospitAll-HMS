import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {

  sidebarSubject = new BehaviorSubject<string>('summary');
  newSection = this.sidebarSubject.asObservable();
  constructor() { }

  setNewSection(section: string){
    this.sidebarSubject.next(section)
  }
}
