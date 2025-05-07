import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./admin-interface/header/header.component";
import { ClientAppointmentComponent } from "./client-appointment/client-appointment.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ClientAppointmentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-end';
}
