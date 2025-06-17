import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { NotificationDto } from '../../models/notification-dto';
import { NotificationService } from '../../services/client-services/notification.service';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';
import { AppointmentService } from '../../services/client-services/appointment.service';
import Swal from 'sweetalert2';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { FeedbackService } from '../../services/feedback-service/feedback.service';
import { Feedback } from '../../doctor/doctor-dashboard/doctor-dashboard.component';
import { FilesGeneratorService } from '../../services/shared-services/files-generator.service';
import { ClientProfileComponent } from "./client-profile/client-profile.component";
import { ClientAppointmentsComponent } from "./client-appointments/client-appointments.component";
import { ClientPrescriptionsComponent } from './client-prescriptions/client-prescriptions.component';
import { ClientNotificationsComponent } from './client-notifications/client-notifications.component';
import { ClientSupportComponent } from "./client-support/client-support.component";
import { ClientDocumentsComponent } from "./client-documents/client-documents.component";
import { ClientFeedbackComponent } from "./client-feedback/client-feedback.component";
import { ClientDashboardSummaryComponent } from "./client-dashboard-summary/client-dashboard-summary.component";
import { ClientLoadingWrapperComponent } from "./client-loading-wrapper/client-loading-wrapper.component";
import { ClientHeaderComponent } from "./client-header/client-header.component";
import { ClientSidebarComponent } from "./client-sidebar/client-sidebar.component";

export interface VisitedDoctorDto {
  id: number;
  fullName: string;
}

@Component({
  selector: 'app-dashboard-client',
  imports: [NgIf, FormsModule, ClientProfileComponent, ClientAppointmentsComponent, ClientPrescriptionsComponent, ClientNotificationsComponent, ClientSupportComponent, ClientDocumentsComponent, ClientFeedbackComponent, ClientDashboardSummaryComponent, ClientDashboardSummaryComponent, ClientLoadingWrapperComponent, ClientHeaderComponent, ClientSidebarComponent],
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

  sections=[
    {
    section:'dashboard',
    icon:'fas fa-home'
    },
    {
    section:'profile',
    icon:'fas fa-user'
    },
    {
    section:'appointments',
    icon:'fas fa-calendar-alt'
    },
    {
    section:'records',
    icon:'fas fa-file-medical'
    },
    {
    section:'notifications',
    icon:'fas fa-file-invoice-dollar'
    },
    {
    section:'documents',
    icon:'fas fa-file-download'
    },
    {
    section:'feedback',
    icon:'fas fa-comment-dots'
    },
    {
    section:'support',
    icon:'fas fa-question-circle'
    }
  ]
  constructor(
    private router: Router,
    private localS: LocalStorageManagerService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.getProfile();
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
