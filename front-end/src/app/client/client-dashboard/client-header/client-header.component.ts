import { NgIf } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-header',
  imports: [NgIf],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent {


  @Input({ required: true }) unreadNotificationsCount!: number;
  @Input({ required: true }) patientName!: string;
  activeSection = output<string>();

  showOptions = false;
  title = 'Your Hospital Dashboard';

  constructor(private localS: LocalStorageManagerService, private router: Router){}
  onShowOptions() {
    this.showOptions = !this.showOptions;
  }

  setActiveSection(section: string) {
    this.activeSection.emit(section)
  }

  logout() {
    this.localS.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');
  }
}
