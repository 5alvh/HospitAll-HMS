import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faUser,
  faPrescriptionBottle,
  faFlask,
  faPlus,
  faSave,
  faTimes,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faChartDiagram,
  faEdit,
  faPhone,
  faChartLine,
  faPrint,
  faPills,
  faStethoscope,
  faAllergies,
  faFileMedical,
  faInfoCircle,
  faCalendar,
  faLocationDot,
  faEnvelope,
  faIdCard,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { DoctorService } from '../../../../services/doctor-services/doctor.service';

@Component({
  selector: 'app-patient-details',
  imports: [NgIf, DatePipe, NgFor, FontAwesomeModule, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class PatientDetailsComponent implements OnInit {

  @Input({ required: true }) userId!: number;
  @Input({ required: true }) selectedUser!: any;
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

  goBackEvent = output();
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
    phone: faPhone,
    location: faLocationDot,
    idCard: faIdCard,
    calendar: faCalendar,
    heart: faHeart,
    info: faInfoCircle,
    medical: faFileMedical,
    allergy: faAllergies,
    condition: faStethoscope,
    medication: faPills,
    print: faPrint,
    edit: faEdit,
    chart: faChartLine,
    download: faDownload
  };

  constructor(private fb: FormBuilder, private doctorService: DoctorService) {

    // Initialize forms
    this.prescriptionForm = this.fb.group({
      medications: this.fb.array([this.createMedicationForm()])
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

  private createMedicationForm(): FormGroup {
    return this.fb.group({
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      notes: ['']
    });
  }

  get medications(): FormArray {
    return this.prescriptionForm.get('medications') as FormArray;
  }

  removeMedication(index: number): void {
    if (this.medications.length > 1) {
      this.medications.removeAt(index);
    }
  }

  // Medication management
  addMedication(): void {
    this.medications.push(this.createMedicationForm());
  }

  goBack() {
    this.goBackEvent.emit();
  }

  ngOnInit(): void {
    this.loadUserData(this.userId);
    this.activeTab = 'prescriptions';
    this.resetForms();
  }

  setActiveTab(tab: 'prescriptions' | 'appointments' | 'labResults'): void {
    this.activeTab = tab;
    this.resetForms();
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

  loadUserData(userId: number): void {
    this.doctorService.getPatientById(userId).subscribe((response) => {
      this.prescriptions = response.prescriptionsReceived;
      this.appointments = response.appointments;
      this.labResults = response.labResultsReceived;
      console.log(response)
    })
  }
}
