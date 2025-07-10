import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor-services/doctor.service';

@Component({
  selector: 'app-header',
  imports: [NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  @Input() activeSection!: string;
  showUserMenu: boolean = false;
  fullName: string = '';
  @Input() dashboardStats: any = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };

  @Output() sectionChange = new EventEmitter<string>();

  get abbreviatedName(): string {
    const names = this.fullName.split(' ');
    return names.map(name => name.charAt(0)).join('');
  }
  changeSection(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
  constructor(private localStorageService: LocalStorageManagerService,
    private router: Router, private docService: DoctorService) {

  }
  ngOnInit(): void {
    this.loadDoctor();
  }
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
  logout() {
    this.localStorageService.clearAuth();
    this.router.navigate(['/login']);
    console.log('Logging out...');

  }

  loadDoctor() {
    this.docService.getProfile().subscribe({
      next: (response) => {
        this.fullName = response.fullName;
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });
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
