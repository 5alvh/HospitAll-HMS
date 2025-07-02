import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DoctorDtoGet } from '../../../models/doctor-dto-get';
import { DecimalPipe } from '@angular/common';
import { DoctorService } from '../../../services/doctor-services/doctor.service';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowTrendUp, faCalendar, faCalendarPlus, faCalendarTimes, faCheck, faComment, faDashboard, faEllipsis, faFileInvoice, faFilePrescription, faPlay, faPrescription, faStar, faStethoscope, faUserMd, faUsers, faVial, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-summary',
  imports: [NgClass, NgFor, DecimalPipe, NgIf, RouterLink, DatePipe, FontAwesomeModule],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.scss',
  providers: [DecimalPipe],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSummaryComponent implements OnInit {

  todaysAppointments: any[] = [];
  dashboardStats: any = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };
  isLoading = false;
  currentDate = Date.now()

  icons={
    dashboard: faDashboard,
    calendar:faCalendar,
    trendUp: faArrowTrendUp,
    check: faCheck,
    prescription: faPrescription,
    warning: faWarning,
    users: faUsers,
    star: faStar,
    comment: faComment,
    play: faPlay,
    ellipsis: faEllipsis,
    calendarTimes: faCalendarTimes,
    calendarPlus: faCalendarPlus,
    filePrescription: faFilePrescription,
    stethoscope: faStethoscope,
    fileInvoice: faFileInvoice,
    userMd: faUserMd,
    vial: faVial
  }
  getAppointmentTrend(): string {
    return this.dashboardStats.todayAppointments > 5 ? 'Busy day' : 'Manageable schedule';
  }
  constructor(private docService: DoctorService) { }
  ngOnInit(): void {
    this.isLoading = true;
    this.docService.getSummary().subscribe(
      (response) => {

        this.dashboardStats = {
          todayAppointments: response.todayAppointments.length,
          pendingPrescriptions: response.pendingPrescriptions,
          totalPatients: response.totalPatients,
          averageRating: response.averageRating
        };
        response.todayAppointments.forEach(
          (appointment: AppointmentDtoGet) => {
            const date = new Date(appointment.appointmentDateTime);
            this.todaysAppointments.push(
              {
                id: appointment.id,
                clientFullName: appointment.clientFullName,
                appointmentDateTime: appointment.appointmentDateTime,
                date: date,
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: appointment.status,
                reason: appointment.reason,
                diagnosis: appointment.diagnosis,
                type: appointment.type
              }
            )
          }
        )
        console.log("x" + response.todayAppointments)
        console.log("y" + this.todaysAppointments)
        this.isLoading = false;

      }
    )
  }
}
