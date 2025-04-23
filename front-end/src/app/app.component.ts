import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { AppointmentsComponent } from "./cards/appointments/appointments.component";
import { AvailableBedsComponent } from "./cards/available-beds/available-beds.component";
import { TotalPatientComponent } from "./cards/total-patient/total-patient.component";
import { PatientAdmissionsComponent } from "./patient-admissions/patient-admissions.component";
import { RecentPatientsComponent } from "./recent-patients/recent-patients.component";
import { DepStatusComponent } from "./dep-status/dep-status.component";
import { TodayAppointmentsComponent } from "./today-appointments/today-appointments.component";
import { InventoryStatusComponent } from "./inventory-status/inventory-status.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AppointmentsComponent, AvailableBedsComponent, TotalPatientComponent, PatientAdmissionsComponent, RecentPatientsComponent, DepStatusComponent, TodayAppointmentsComponent, InventoryStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-end';
}
