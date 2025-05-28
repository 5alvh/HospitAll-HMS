import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { NotificationDto } from '../../models/notification-dto';
import { NotificationService } from '../../services/notifications-service/notification.service';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';
import { AppointmentService } from '../../services/client-services/appointment.service';
import Swal from 'sweetalert2';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { FeedbackService } from '../../services/feedback-service/feedback.service';
import { Feedback } from '../../doctor/doctor-dashboard/doctor-dashboard.component';

export interface VisitedDoctorDto {
  id: number;
  fullName: string;
}

@Component({
  selector: 'app-dashboard-client',
  imports: [NgIf, NgFor, FormsModule, RouterLink, TitleCasePipe, DatePipe, NgClass],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.scss',
  providers: [DatePipe, TitleCasePipe],
  encapsulation: ViewEncapsulation.None

})
export class DashboardClientComponent implements OnInit {
editFeedback(arg0: number) {
throw new Error('Method not implemented.');
}
deleteFeedback(arg0: number) {
throw new Error('Method not implemented.');
}

  selectedRating: number = 0;
  hoveredRating: number = 0;
  doctorFeedbackId: number | null = null;
  selectedFeedbackType: string = '';
  isGeneralFeedback: boolean = true;
  activeIndex: number | null = null;
  hideCancelled = true;
  showOptions = false;
  title = 'Your Hospital Dashboard';
  activeSection = 'dashboard';
  patient!: ClientDtoGet;
  isLoading: boolean = true;
  notifications!: NotificationDto[];
  medications: MedicalPrescriptionDtoGet[] = [];
  upcomingAppointments: AppointmentDtoGet[] = [];
  clientService = inject(ClientService);
  pastAppointments: AppointmentDtoGet[] = [];
  topUnseenNotifications: NotificationDto[] = [];
  labResults: LabResultDtoGet[] = [];
  feedbackDoctors: VisitedDoctorDto[] = [];
  selectedAppointment: AppointmentDtoGet | null = null;
  feedbackMessage: string = '';
  feedbacks: Feedback[] = [];

  showDetails(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }
  get filteredUpcomingAppointments() {
    return this.hideCancelled
      ? this.upcomingAppointments.filter(a => a.status !== 'CANCELLED')
      : this.upcomingAppointments;
  }
  closeDetails() {
    this.selectedAppointment = null;
  }
  onFeedbackTypeChange() {
    this.isGeneralFeedback = !(this.selectedFeedbackType === 'doctor');
    if (this.selectedFeedbackType === 'doctor') {
      this.doctorService.getVisitedDoctorByClientId(this.patient.id).subscribe({
        next: (doctors) => {
          this.feedbackDoctors = doctors;
        },
        error: (error) => {
          console.error('Error fetching visited doctors:', error);
        }
      });
    }
  }
  downloadAppointment(appointment: AppointmentDtoGet) {
    const summary = `
    Appointment Summary
    -------------------
    Client: ${appointment.clientFullName}
    Doctor: ${appointment.doctorFullName}
    Department: ${appointment.departmentName}
    Date & Time: ${appointment.appointmentDateTime}
    Reason: ${appointment.reason}
    Status: ${appointment.status}
    Type: ${appointment.type}
  `;

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `appointment_${appointment.id}.txt`;
    link.click();
  }

  constructor(private datePipe: DatePipe,
    private router: Router,
    private localS: LocalStorageManagerService,
    private notificationsService: NotificationService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.getProfile();
  }

  refreshTopUnseenNotifications() {
    this.topUnseenNotifications = this.notifications.filter(n => !n.seen).slice(0, 3);
  }
  markAsRead(id: number) {
    const notifInArray = this.notifications.find(n => n.id === id)!;
    console.log('Marking notification as read:', notifInArray);
    notifInArray.seen = true;
    this.notificationsService.markAsRead(id).subscribe({
      next: () => {
        console.log('Notification marked as read successfully.');
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
    this.refreshTopUnseenNotifications();
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
        this.labResults = this.patient.labResults;
        this.feedbacks = this.patient.feedbacksWritten;
        console.log('Feedbacks:', this.feedbacks);
        this.refreshTopUnseenNotifications();

        this.medications = this.patient.prescriptions;
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
        console.log('Top unseen notifications:', this.topUnseenNotifications);
        console.log('All prescriptions:', this.patient.prescriptions);
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


  cancelAppointment(appId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Know that if you cancel your appointment, you can't undo it and must request a new one.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.cancelAppointment(appId).subscribe({
          next: () => {
            const index = this.upcomingAppointments.findIndex(appointment => appointment.id === appId);
            this.upcomingAppointments[index].status = AppointmentStatus.CANCELLED;
            Swal.fire(
              'Cancelled!',
              'Your appointment has been cancelled.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an issue cancelling your appointment.',
              'error'
            );
          }
        });
      }
    });
  }


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

  payInvoice(id: string) {
    alert(`Redirecting to payment gateway for invoice ${id}`);
  }

  faqs = [
    {
      question: 'How do I schedule an appointment?',
      answer: 'You can schedule an appointment through the "Appointments" section. Select "Book New", choose your department, doctor, and preferred date, then check available slots and book your appointment.'
    },
    {
      question: 'How can I access my medical records?',
      answer: 'Your medical records can be accessed in the "Medical Records" section. You can view your prescriptions, lab results, medical history, and vaccination records.'
    },
    {
      question: 'How do I pay my bills online?',
      answer: 'You can pay your bills through the "Billing" section. Select the invoice you wish to pay and click "Pay Now" to be directed to our secure payment gateway.'
    },
    {
      question: 'How do I start a telemedicine consultation?',
      answer: 'Navigate to the "Telemedicine" section, where you can schedule a video consultation or start a chat with healthcare providers.'
    }
  ];

  toggleAnswer(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
  setRating(rating: number): void {
    this.selectedRating = rating;
    console.log('Selected rating:', this.selectedRating);
  }

  setHover(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHover(): void {
    this.hoveredRating = 0;
  }

  submitFeedback(): void {
    if (this.selectedRating === 0) {
      Swal.fire('Please select a rating before submitting.');
      return;
    }

    if (this.feedbackMessage.trim() === '' || this.feedbackMessage.length < 5) {
      Swal.fire('Please enter a feedback message before submitting.');
      return;
    }
    const feedback = {
      comment: this.feedbackMessage.trim(),
      rating: this.selectedRating,
      writtenToId: this.isGeneralFeedback ? null : this.doctorFeedbackId,
      type: this.isGeneralFeedback ? 'GENERAL' : 'DOCTOR'
    };
    console.log('Submitting feedback:', feedback);
    this.feedbackService.submitFeedback(feedback).subscribe({
      next: () => {
        Swal.fire('Thank you for your feedback!');
      },
      error: () => {
        Swal.fire('There was an error submitting your feedback. Please try again later.');
      }
    });


    this.selectedRating = 0;
    this.hoveredRating = 0;
    this.selectedFeedbackType = '';
  }
}
