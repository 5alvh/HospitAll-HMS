import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HeaderWelcomeComponent } from '../header-welcome/header-welcome.component';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, HeaderWelcomeComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent {

}
