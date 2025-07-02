import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  faSearch,
  faUser,
  faCalendar,
  faPrescriptionBottle,
  faFlask,
  faPlus,
  faSave,
  faTimes,
  faBirthdayCake,
  faVenus,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DoctorService } from '../../../services/doctor-services/doctor.service';
import { ClientDtoGet } from '../../../models/client-dto-get';
import { PatientDetailsComponent } from "./patient-details/patient-details.component";

@Component({
  selector: 'app-patients',
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, FontAwesomeModule, PatientDetailsComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class PatientsComponent implements OnInit {

  icons = {
    search: faSearch,
    user: faUser,
    prescription: faPrescriptionBottle,
    appointment: faCalendarAlt,
    lab: faFlask,
    plus: faPlus,
    close: faTimes,
    save: faSave,
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
    envelope: faEnvelope,
    phone: faPhone
  };

  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  searchTerm = '';
  filteredUsers: ClientDtoGet[] = [];
  searchBouncer: any;
  selectedUser: any = null;

  ngOnInit(): void {
    this.loadPatients();
  }
  loadPatients(): void {
    this.doctorService.getPatients(this.searchTerm, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.filteredUsers = response.content;
        this.totalPages = response.totalPages - 1;
      });
  }

  onSearchChange(): void {
    clearTimeout(this.searchBouncer)
    this.searchBouncer = setTimeout(
      () => {
        this.currentPage = 0;
        this.loadPatients();
      }, 1000
    )
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPatients();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPatients();
    }
  }

  // Tab Management
  activeTab: 'prescriptions' | 'appointments' | 'labResults' = 'prescriptions';

  // Forms Visibility
  showPrescriptionForm = false;
  showAppointmentForm = false;
  showLabResultForm = false;

  // Form Groups
  prescriptionForm: FormGroup;
  appointmentForm: FormGroup;
  labResultForm: FormGroup;

  // Sample Data
  prescriptions: any[] = [];
  appointments: any[] = [];
  labResults: any[] = [];

  constructor(private fb: FormBuilder, private doctorService: DoctorService) {
    // Initialize forms
    this.prescriptionForm = this.fb.group({
      medication: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      instructions: ['']
    });

    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['scheduled', Validators.required],
      notes: ['']
    });

    this.labResultForm = this.fb.group({
      testName: ['', Validators.required],
      result: ['', Validators.required],
      normalRange: ['', Validators.required],
      status: ['normal', Validators.required],
      notes: ['']
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.activeTab = 'prescriptions';
    this.resetForms();
    this.loadUserData(user.id);
  }

  loadUserData(userId: number): void {
    this.doctorService.getPatientById(userId).subscribe((response) => {
      this.prescriptions = response.prescriptionsReceived;
      this.appointments = response.appointments;
      this.labResults = response.labResultsReceived;
      console.log(response)
    })
  }

  setActiveTab(tab: 'prescriptions' | 'appointments' | 'labResults'): void {
    this.activeTab = tab;
    this.resetForms();
  }
  goBack() {
    this.selectedUser = null;
  }
  resetForms(): void {
    this.showPrescriptionForm = false;
    this.showAppointmentForm = false;
    this.showLabResultForm = false;
    this.prescriptionForm.reset();
    this.appointmentForm.reset({ status: 'scheduled' });
    this.labResultForm.reset({ status: 'normal' });
  }

  addPrescription(): void {
    if (this.prescriptionForm.valid) {
      const newPrescription = {
        ...this.prescriptionForm.value,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      this.prescriptions = [newPrescription, ...this.prescriptions];
      this.resetForms();
    }
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const newAppointment = {
        ...this.appointmentForm.value,
        id: Date.now()
      };
      this.appointments = [newAppointment, ...this.appointments];
      this.resetForms();
    }
  }

  addLabResult(): void {
    if (this.labResultForm.valid) {
      const newLabResult = {
        ...this.labResultForm.value,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      this.labResults = [newLabResult, ...this.labResults];
      this.resetForms();
    }
  }
}

