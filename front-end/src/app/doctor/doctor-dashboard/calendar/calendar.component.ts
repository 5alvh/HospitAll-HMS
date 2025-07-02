import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';
import { AppointmentService } from '../../../services/doctor-services/appointment.service';

@Component({
  selector: 'app-calendar',
  imports: [NgFor, NgIf],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  constructor(private appointmentService: AppointmentService) { }
  ngOnInit(): void {
    this.loadAppointments();
  }

  totalPages: number = 0;
  size: number = 1280;

  start?: string;
  end?: string;

  filterStatus = 'all';
  currentDate: Date = new Date();
  appointments!: any[];

  showCancelledAppointments = true;
  loadAppointments() {
    this.appointments = [];
    const startDate = new Date(this.getCalendarStartAndEndDate().start);
    const endDate = new Date(this.getCalendarStartAndEndDate().end);
    console.log(startDate);
    console.log(endDate);
    this.appointmentService.getAllAppointmentsPaged(0, this.size, this.filterStatus, !this.showCancelledAppointments, endDate, startDate).subscribe(
      (response) => {
        this.totalPages = response.totalPages - 1 || 0;
        response.content.forEach((appointment: AppointmentDtoGet) => {
          const date = new Date(appointment.appointmentDateTime);
          this.appointments.push({
            id: appointment.id,
            clientFullName: appointment.clientFullName,
            appointmentDateTime: appointment.appointmentDateTime,
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appointment.status,
            reason: appointment.reason,
            diagnosis: appointment.diagnosis,
            type: appointment.type
          });
        });

      },
      (error) => {
        console.log(error)
      }
    )
    console.log(this.appointments)
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadAppointments();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadAppointments();
  }

  getCurrentMonth(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getCalendarStartAndEndDate(): { start: Date, end: Date } {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const startOffset = startDayOfWeek > 0 ? startDayOfWeek : 0;
    const start = new Date(year, month - 1, prevMonthLastDay - startOffset + 1);

    const end = new Date(start);
    end.setDate(start.getDate() + 41);

    return { start, end };
  }


  getCalendarDays(): any[] {
    const days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const endDay = lastDayOfMonth.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.buildDay(date, false));
    }

    for (let i = 1; i <= endDay; i++) {
      const date = new Date(year, month, i);
      days.push(this.buildDay(date, true));
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.buildDay(date, false));
    }

    console.log('Calendar days:', days);
    return days;
  }

  buildDay(date: Date, isCurrentMonth: boolean): any {
    const dayAppointments = this.appointments.filter(app => {
      const appDate = new Date(app.appointmentDateTime);

      return appDate.getFullYear() === date.getFullYear() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getDate() === date.getDate();
    });

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return {
      date,
      number: date.getDate(),
      isCurrentMonth,
      isToday,
      hasAppointments: dayAppointments.length > 0,
      appointments: dayAppointments.map(app => ({
        time: new Date(app.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clientFullName: app.clientFullName,
        status: app.status,
      }))
    };
  }

}
