import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

  @Input() activeSection!: string;
  showUserMenu: boolean = false;
  @Input() dashboardStats: any = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };

  @Output() sectionChange = new EventEmitter<string>();

  changeSection(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
  constructor(private localStorageService: LocalStorageManagerService,
    private router: Router) {

  }
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
  logout() {
    this.localStorageService.clearAuth();
    this.router.navigate(['/login']);
    console.log('Logging out...');

  }
  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard Overview',
      'calendar': 'Appointment Calendar',
      'appointments': 'Appointments Management',
      'book-appointment': 'Book New Appointment',
      'prescriptions': 'Medical Prescriptions',
      'create-prescription': 'Create Prescription',
      'profile': 'My Profile',
      'feedback': 'Patient Feedback',
      'support': 'Support & Help'
    };
    return titles[this.activeSection] || 'Dashboard';
  }
}
