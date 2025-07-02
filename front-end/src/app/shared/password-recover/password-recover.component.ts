import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordService } from '../../services/shared-services/password.service';

@Component({
  selector: 'app-password-recover',
  imports: [RouterLink, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './password-recover.component.html',
  styleUrl: './password-recover.component.scss'
})
export class PasswordRecoverComponent {
  forgotForm!: FormGroup;
  submitted = false;
  processing = false;
  requestSuccess = false;
  requestError = false;
  errorMessage = '';
  redirectionTime: number = 10;
  countDounInterval :any;
  constructor(private fb: FormBuilder, private router: Router, private passwordService: PasswordService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.processing = true;
    this.requestError = false;
    setTimeout(() => {
      this.passwordService.forgetPassword(this.forgotForm.value.email).subscribe(
        (response) => {
          this.processing = false;
          this.requestSuccess = true;
          this.redirectionTime = 10;

          this.countDounInterval = setInterval(() => {
            this.redirectionTime = this.redirectionTime - 1;
            console.log(this.redirectionTime)
          }, 1000);
          setTimeout(() => {
            clearInterval(this.countDounInterval);
            this.router.navigate(['/login'])
          }, 10000)
        },
        (error) => {
          console.error(error);
          this.processing = false;
          const demoError = true;
          if (demoError) {
            this.requestError = true;
            this.errorMessage =
              'We couldn’t find an account with that email. Please try again.';
          }
        }
      );

    }, 1800);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
