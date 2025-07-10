import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private todaysAppointments: any[] = [];
  private isLoaded = false;

  private sharedStatsSubject = new BehaviorSubject<{
    todayAppointments: any[],
    pendingPrescriptions: number,
    totalPatients: number,
    averageRating: number
  }>({
    todayAppointments: [],
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  });

  sharedStats$ = this.sharedStatsSubject.asObservable();

  constructor(private docService: DoctorService) { }

  loadStats() {
    if (this.isLoaded) {
      console.log('Stats are already loaded.');
      return;
    }

    this.docService.getSummary().subscribe({
      next: (response) => {
        console.log('Loading stats...');
        console.log(response);
        this.sharedStatsSubject.next({
          todayAppointments: response.todayAppointments,
          pendingPrescriptions: response.pendingPrescriptions,
          totalPatients: response.totalPatients,
          averageRating: response.averageRating
        });

        this.todaysAppointments = response.todayAppointments.map(
          (appointment: AppointmentDtoGet) => {
            const date = new Date(appointment.appointmentDateTime);
            return {
              id: appointment.id,
              clientFullName: appointment.clientFullName,
              appointmentDateTime: appointment.appointmentDateTime,
              date: date,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: appointment.status,
              reason: appointment.reason,
              diagnosis: appointment.diagnosis,
              type: appointment.type
            };
          }
        );

        this.isLoaded = true;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  refreshStats() {
    this.isLoaded = false;
    this.todaysAppointments = [];
    this.loadStats();
  }

  getTodaysAppointments() {
    return this.todaysAppointments;
  }
}
