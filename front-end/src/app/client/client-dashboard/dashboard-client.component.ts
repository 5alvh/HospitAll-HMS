import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-client',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.scss',
  providers: [DatePipe],
})
export class DashboardClientComponent implements OnInit {

  title = 'MediCare Hospital Dashboard';
  activeSection = 'dashboard';
  patient!: ClientDtoGet;
  isLoading: boolean = true;
  upcomingAppointments: AppointmentDtoGet[] = [];
  clientService = inject(ClientService);
  pastAppointments: AppointmentDtoGet[] = [];

  constructor(private datePipe: DatePipe, private route: Router) { }

  ngOnInit(): void {
    this.getProfile();

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

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        console.log('User:', response);

        response.createdAt = response.createdAt.split('T')[0];
        const now = new Date();

        this.patient = response;

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
        this.isLoading = false;

      }
    });
  }

  onDeleteAccount() {
    if (confirm('Are you sure you want to inactivate your account? This action cannot be undone.')) {
      this.clientService.inactivateAccount().subscribe({
        next: () => {
          alert('Your account has been inactivated successfully.');
          this.route.navigate(['/login']);
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
    this.route.navigate(['/book-appointment']);
  }

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

  // Notifications
  notifications = [
    {
      type: 'Appointment',
      message: 'Reminder: Cardiology appointment tomorrow at 10:30 AM',
      date: '14 May 2025',
      read: false
    },
    {
      type: 'Lab Result',
      message: 'New lab results available for Lipid Profile',
      date: '4 April 2025',
      read: true
    },
    {
      type: 'Medication',
      message: 'Refill reminder: Lisinopril - 7 days remaining',
      date: '10 May 2025',
      read: false
    },
    {
      type: 'Announcement',
      message: 'Free diabetes screening camp on May 25th',
      date: '8 May 2025',
      read: false
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

  // Doctors by department
  doctors = {
    'Cardiology': ['Dr. Sarah Johnson', 'Dr. James Rodriguez'],
    'Dermatology': ['Dr. Emily Chen', 'Dr. David Brown'],
    'Neurology': ['Dr. Michael Chen', 'Dr. Lisa Wong'],
    'General Medicine': ['Dr. Robert Williams', 'Dr. Maria Garcia']
  };

  selectedDepartment = 'Cardiology'; //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  selectedDoctor = '';
  selectedDate = '';
  availableSlots: string[] = [];

  // Function to change active section
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  // Function to load doctors when department is selected
  onDepartmentChange() {
    this.selectedDoctor = '';
    this.selectedDate = '';
    this.availableSlots = [];
  }

  // Function to check available slots
  checkAvailability() {
    if (this.selectedDoctor && this.selectedDate) {
      // In a real app, this would make an API call
      this.availableSlots = ['9:00 AM', '10:30 AM', '1:15 PM', '3:45 PM'];
    }
  }

  // Function to book appointment
  bookAppointment(slot: string) {
    // In a real app, this would make an API call to book the appointment
    alert(`Appointment booked successfully with ${this.selectedDoctor} on ${this.selectedDate} at ${slot}`);

    // Reset form
    this.selectedDepartment = '';
    this.selectedDoctor = '';
    this.selectedDate = '';
    this.availableSlots = [];
  }


  // Function to mark notification as read
  markAsRead(index: number) {
    this.notifications[index].read = true;
  }

  // Function to get unread notification count
  getUnreadCount() {
    return this.notifications.filter(notification => !notification.read).length;
  }

  // Function to pay invoice
  payInvoice(id: string) {
    // In a real app, this would redirect to payment gateway
    alert(`Redirecting to payment gateway for invoice ${id}`);
  }

}
