import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { AppointmentDtoGet } from '../../../../models/appointment-dto-get';
import { AppointmentService } from '../../../services/appointment.service';
import { FilesGeneratorService } from '../../../../services/shared-services/files-generator.service';
import { AppointmentStatus } from '../../../../models/enums/appointment-status';
import { response } from 'express';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HistoryComponent } from "./history/history.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-client-appointments',
  imports: [RouterLink, FormsModule, NgIf, ClientLoadingWrapperComponent, FontAwesomeModule, RouterOutlet],
  templateUrl: './client-appointments.component.html',
  styleUrl: './client-appointments.component.scss',
  providers: [DatePipe],

})
export class ClientAppointmentsComponent {

  appointments!: AppointmentDtoGet[];
  selectedAppointment: AppointmentDtoGet | null = null;
  hideCancelled = true;
  pastAppointments: AppointmentDtoGet[] = [];
  upcomingAppointments: AppointmentDtoGet[] = [];
  isLoading: boolean = true;
  clickedTab = 'upcoming';

  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };

  currentPageAU = 0;
  pageSizeAU = 5;
  totalPagesAU = 0;

  currentPageH = 0;
  pageSizeH = 5;
  totalPagesH = 0;

  constructor(private route: ActivatedRoute, private filesGenerator: FilesGeneratorService,
    private angularRouter: Router
  ) { }


  ngOnInit(): void {
    this.isLoading = false;
    this.syncTabWithRoute();

    // Subscribe to route changes
    this.angularRouter.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncTabWithRoute();
    });
  }

  private syncTabWithRoute(): void {
    const url = this.angularRouter.url;
    if (url.includes('/history')) {
      this.clickedTab = 'history';
    } else if (url.includes('/upcoming')) {
      this.clickedTab = 'upcoming';
    }
  }

}


