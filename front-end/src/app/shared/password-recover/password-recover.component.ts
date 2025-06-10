import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordService } from '../../services/shared-services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-recover',
  imports: [RouterLink, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './password-recover.component.html',
  styleUrl: './password-recover.component.scss'
})
export class PasswordRecoverComponent {
  forgotForm!: FormGroup;           // declared but not built yet

  submitted = false;
  processing = false;
  requestSuccess = false;
  requestError = false;
  errorMessage = '';

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
          Swal.fire({
            icon: 'success',
            title: 'Password Reset Request Sent',
            text: 'Please check your email for instructions on how to reset your password.',
          });
          this.requestSuccess = true;
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
    this.router.navigate(['/']);
  }
}
