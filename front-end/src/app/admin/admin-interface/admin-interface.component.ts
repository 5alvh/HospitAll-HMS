import { Component } from "@angular/core";
import { TotalPatientComponent } from "./cards/total-patient/total-patient.component";
import { AppointmentsComponent } from "./cards/appointments/appointments.component";
import { AvailableBedsComponent } from "./cards/available-beds/available-beds.component";
import { PatientAdmissionsComponent } from "./patient-admissions/patient-admissions.component";
import { RecentPatientsComponent } from "./recent-patients/recent-patients.component";
import { DepStatusComponent } from "./dep-status/dep-status.component";
import { TodayAppointmentsComponent } from "./today-appointments/today-appointments.component";
import { InventoryStatusComponent } from "./inventory-status/inventory-status.component";


@Component({
    selector: 'app-admin-interface',
    templateUrl: './admin-interface.component.html',
    styleUrls: ['./admin-interface.component.css'],
    imports: [ TotalPatientComponent, AppointmentsComponent, AvailableBedsComponent, PatientAdmissionsComponent, RecentPatientsComponent, DepStatusComponent, TodayAppointmentsComponent, InventoryStatusComponent]
})
export class AdminInterfaceComponent {

}