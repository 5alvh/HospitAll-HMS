import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-doctor-dashboard',
  imports: [FormsModule, NgIf, NgFor, NgClass, TitleCasePipe],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  providers: [DatePipe],
})
export class DoctorDashboardComponent {
    doctor = {
    name: 'Dr. Sarah Johnson',
    id: 'MD12345',
    specialization: 'Cardiology',
    department: 'Cardiac Care Unit',
    isOnline: true,
    workingHours: '8:00 AM - 5:00 PM',
    teleconsultation: true
  };

  appointmentsToday = [
    { 
      time: '09:00 AM', 
      patient: 'James Wilson', 
      patientId: 'P12001', 
      status: 'confirmed', 
      reason: 'Follow-up after surgery',
      isNew: false
    },
    { 
      time: '10:30 AM', 
      patient: 'Emma Thompson', 
      patientId: 'P12034', 
      status: 'confirmed', 
      reason: 'Chest pain evaluation',
      isNew: true
    },
    { 
      time: '11:45 AM', 
      patient: 'Robert Chen', 
      patientId: 'P11087', 
      status: 'no-show', 
      reason: 'Annual check-up',
      isNew: false
    },
    { 
      time: '02:15 PM', 
      patient: 'Maria Garcia', 
      patientId: 'P12567', 
      status: 'confirmed', 
      reason: 'ECG interpretation',
      isNew: false
    },
    { 
      time: '03:30 PM', 
      patient: 'John Smith', 
      patientId: 'P10045', 
      status: 'canceled', 
      reason: 'Medication review',
      isNew: false
    },
    { 
      time: '04:45 PM', 
      patient: 'Fatima Ahmed', 
      patientId: 'P13099', 
      status: 'confirmed', 
      reason: 'Teleconsultation - Blood pressure monitoring',
      isNew: false
    }
  ];

  upcomingAppointments = [
    { 
      date: 'Tomorrow',
      count: 8,
      firstAppointment: '08:15 AM',
      lastAppointment: '04:30 PM'
    },
    { 
      date: 'May 15, 2025',
      count: 6,
      firstAppointment: '09:00 AM',
      lastAppointment: '03:45 PM'
    },
    { 
      date: 'May 16, 2025',
      count: 5,
      firstAppointment: '10:30 AM',
      lastAppointment: '05:00 PM'
    }
  ];
  
  selectedPatient!: any;
  activeTab = 'appointments';
  searchTerm = '';
  notifications = [
    { type: 'lab', message: 'New lab results for Robert Chen', time: '1 hour ago', read: false },
    { type: 'appointment', message: 'New appointment request from Lisa Wong', time: '3 hours ago', read: false },
    { type: 'message', message: 'Message from Nurse Rodriguez re: patient Maria Garcia', time: '5 hours ago', read: true }
  ];
  patientSearchResults!: any[];
  
  // Mock data for charts
  monthlyAppointments = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    data: [65, 59, 80, 81, 56]
  };
  
  patientOutcomes = {
    labels: ['Improved', 'Stable', 'Referred', 'Follow-up Required'],
    data: [45, 25, 15, 15]
  };
showNotifications: any;
  
  constructor() { }

  ngOnInit(): void {
    // Initialize dashboard data
  }
  
  toggleOnlineStatus(): void {
    this.doctor.teleconsultation = !this.doctor.teleconsultation;
  }
  
  changeTab(tab: string): void {
    this.activeTab = tab;
  }
  
  viewPatientDetails(patient: any): void {
    this.selectedPatient = {
      name: patient.patient,
      id: patient.patientId,
      age: 58,
      gender: 'Male',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Aspirin'],
      diagnoses: [
        { date: '2024-12-10', condition: 'Hypertension', notes: 'Prescribed ACE inhibitors' },
        { date: '2025-01-25', condition: 'Mild Coronary Artery Disease', notes: 'Lifestyle modifications recommended' }
      ],
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-12-10' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', startDate: '2025-01-25' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', startDate: '2025-01-25' }
      ],
      labResults: [
        { date: '2025-04-15', test: 'Complete Blood Count', result: 'Normal', notes: '' },
        { date: '2025-04-15', test: 'Lipid Panel', result: 'LDL: 140 mg/dL (High)', notes: 'Consider increasing statin dosage' },
        { date: '2025-03-01', test: 'ECG', result: 'Sinus rhythm with occasional PVCs', notes: 'Monitor and repeat in 3 months' }
      ],
      visits: [
        { date: '2025-01-25', reason: 'Chest pain', diagnosis: 'Mild Coronary Artery Disease', treatment: 'Medication and lifestyle changes' },
        { date: '2024-12-10', reason: 'Annual check-up', diagnosis: 'Hypertension', treatment: 'Started on Lisinopril' }
      ]
    };
  }
  
  closePatientDetails(): void {
    this.selectedPatient = null;
  }
  get unreadNotificationsLength(): number {
  return this.notifications.filter(n => !n.read).length;
}
  searchPatients(): void {
    // Mock patient search
    if (this.searchTerm.length > 2) {
      this.patientSearchResults = [
        { name: 'James Wilson', id: 'P12001', lastVisit: '2025-05-01' },
        { name: 'Jane Wilson', id: 'P12002', lastVisit: '2025-04-15' },
        { name: 'Jack Wilson', id: 'P12003', lastVisit: '2025-03-22' }
      ];
    } else {
      this.patientSearchResults = [];
    }
  }
  
  markAllNotificationsAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }
  
  // Mock functions for e-prescriptions and orders
  createNewPrescription(): void {
    console.log('Creating new prescription');
  }
  
  orderLabTest(): void {
    console.log('Ordering lab test');
  }
  
  orderImaging(): void {
    console.log('Ordering imaging');
  }
}
