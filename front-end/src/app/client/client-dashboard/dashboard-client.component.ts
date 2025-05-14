import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { NotificationDto } from '../../models/notification-dto';
import { NotificationService } from '../../services/notifications-service/notification.service';

@Component({
  selector: 'app-dashboard-client',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None // This allows styles to affect all components

})
export class DashboardClientComponent implements OnInit {

  showOptions = false;
  title = 'MediCare Hospital Dashboard';
  activeSection = 'dashboard';
  patient!: ClientDtoGet;
  isLoading: boolean = true;
  upcomingAppointments: AppointmentDtoGet[] = [];
  clientService = inject(ClientService);
  pastAppointments: AppointmentDtoGet[] = [];

  constructor(private datePipe: DatePipe, private router: Router, private localS: LocalStorageManagerService, private notificationsService: NotificationService) { }

  ngOnInit(): void {
    this.getProfile();
  }

  markAsRead(index: number) {
    console.log('Marking notification as read:', this.notifications[index]);
    this.notifications[index].seen = true;
    this.notificationsService.markAsRead(index).subscribe({
      next: () => {
        console.log('Notification marked as read successfully.');
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  getUnreadCount() {
    return this.notifications.filter(notification => !notification.seen).length;
  }

  onShowOptions() {
    this.showOptions = !this.showOptions;
  }

  goToProfile() {
    this.setActiveSection('profile');
    console.log('Navigating to profile...');
  }

  logout() {
    this.localS.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');
  }
  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        console.log('User:', response);

        response.createdAt = response.createdAt.split('T')[0];
        const now = new Date();

        this.patient = response;
        this.notifications = this.patient.notifications;
        if (this.patient && this.patient.appointments) {
          this.patient.appointments.forEach(appointment => {

            const appointmentDate = new Date(appointment.appointmentDateTime);

            if (appointmentDate >= now) {
              this.upcomingAppointments.push({
                ...appointment,
                appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
              });
            } else {
              this.pastAppointments.push({
                ...appointment,
                appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
              });
            }
          });
        }
        console.log('Upcoming Appointments:', this.upcomingAppointments);
        console.log('Past Appointments:', this.pastAppointments);
        console.log('Patient:', this.patient.notifications);
        this.isLoading = false;

      },
      error: (error) => {
        this.localS.clearAuth();
        this.router.navigate(['/']);
        console.error('Error fetching profile:', error);
      }
    });
  }

  onDeleteAccount() {
    if (confirm('Are you sure you want to inactivate your account? This action cannot be undone.')) {
      this.clientService.inactivateAccount().subscribe({
        next: () => {
          alert('Your account has been inactivated successfully.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error inactivating account:', error);
          alert('An error occurred while inactivating your account. Please try again later.');
        }
      });
      console.log('Account inactivated.');
    }
  }

  toBookAppointment() {
    this.router.navigate(['/book-appointment']);
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

  get topUnseenNotifications(): NotificationDto[] {
    return this.notifications.filter(n => !n.seen).slice(0, 3);
  }
  // Notifications
  notifications!: NotificationDto[];
  // Medications
  medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '3 April 2025',
      endDate: '3 July 2025',
      prescribedBy: 'Dr. Sarah Johnson'
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily at bedtime',
      startDate: '3 April 2025',
      endDate: 'Ongoing',
      prescribedBy: 'Dr. Sarah Johnson'
    }
  ];

  // Lab results
  labResults = [
    {
      id: 'LAB-2025-456',
      test: 'Comprehensive Metabolic Panel',
      date: '3 April 2025',
      status: 'Completed',
      resultUrl: 'assets/results/lab-2025-456.pdf'
    },
    {
      id: 'LAB-2025-457',
      test: 'Lipid Profile',
      date: '3 April 2025',
      status: 'Completed',
      resultUrl: 'assets/results/lab-2025-457.pdf'
    },
    {
      id: 'LAB-2025-490',
      test: 'HbA1c',
      date: '10 May 2025',
      status: 'Pending',
      resultUrl: ''
    }
  ];

  // Invoices
  invoices = [
    {
      id: 'INV-2025-789',
      date: '3 April 2025',
      description: 'Cardiology consultation',
      amount: 150.00,
      insurance: 120.00,
      balance: 30.00,
      status: 'Unpaid'
    },
    {
      id: 'INV-2025-790',
      date: '3 April 2025',
      description: 'Laboratory tests',
      amount: 210.00,
      insurance: 168.00,
      balance: 42.00,
      status: 'Unpaid'
    },
    {
      id: 'INV-2025-730',
      date: '15 March 2025',
      description: 'General consultation',
      amount: 100.00,
      insurance: 80.00,
      balance: 20.00,
      status: 'Paid'
    }
  ];



  // Departments for booking
  departments = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'General Medicine',
    'Neurology',
    'Obstetrics & Gynecology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology'
  ];


  // Function to change active section
  setActiveSection(section: string) {
    this.activeSection = section;
  }


  // Function to mark notification as read


  // Function to pay invoice
  payInvoice(id: string) {
    // In a real app, this would redirect to payment gateway
    alert(`Redirecting to payment gateway for invoice ${id}`);
  }

}
