import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {

  constructor(private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
  }
}
