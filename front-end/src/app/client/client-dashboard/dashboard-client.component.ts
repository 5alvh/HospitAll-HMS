import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { NotificationDto } from '../../models/notification-dto';
import { NotificationService } from '../../services/client-services/notification.service';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';
import { AppointmentService } from '../../services/client-services/appointment.service';
import { Feedback } from '../../doctor/doctor-dashboard/doctor-dashboard.component';
import { ClientLoadingWrapperComponent } from "./client-loading-wrapper/client-loading-wrapper.component";
import { ClientHeaderComponent } from "./client-header/client-header.component";
import { ClientSidebarComponent } from "./client-sidebar/client-sidebar.component";
import { NotificationSocketService } from '../../services/client-services/notification-socket.service';
import { NgxSonnerToaster } from 'ngx-sonner';
export interface VisitedDoctorDto {
  id: number;
  fullName: string;
}

@Component({
  selector: 'app-dashboard-client',
  imports: [NgIf, FormsModule, ClientLoadingWrapperComponent, ClientHeaderComponent, ClientSidebarComponent, RouterOutlet, NgxSonnerToaster],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.scss',
  providers: [DatePipe, TitleCasePipe],
  encapsulation: ViewEncapsulation.None

})
export class DashboardClientComponent implements OnInit {

  appointments!: AppointmentDtoGet[];
  hideCancelled = true;
  showOptions = false;
  title = 'Your Hospital Dashboard';
  activeSection = 'dashboard';
  patient!: ClientDtoGet;
  isLoading: boolean = true;
  notifications!: NotificationDto[];
  medications: MedicalPrescriptionDtoGet[] = [];
  upcomingAppointments: AppointmentDtoGet[] = [];
  pastAppointments: AppointmentDtoGet[] = [];
  topUnseenNotifications: NotificationDto[] = [];
  labResults: LabResultDtoGet[] = [];
  feedbackDoctors: VisitedDoctorDto[] = [];
  selectedAppointment: AppointmentDtoGet | null = null;
  feedbacks: Feedback[] = [];


  constructor(
    private router: Router,
    private localS: LocalStorageManagerService,
    private clientService: ClientService,
    private socket: NotificationSocketService
  ) { }

  ngOnInit(): void {
    this.getProfile();
    this.socket.connect(); 
    
  }

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        this.patient = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.localS.clearAuth();
        this.router.navigate(['/']);
        console.error('Error fetching profile:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate} ${formattedTime}`;
  }
  setActiveSection(section: string) {
    this.activeSection = section;
  }


}
