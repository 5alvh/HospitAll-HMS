import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../services/shared-services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  submitted = false;
  processing = false;
  token: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private passwordService: PasswordService, private router: Router) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;
    this.submitted = true;
    this.processing = true;

    this.passwordService.resetPassword(this.token!, this.resetForm.value.password, this.resetForm.value.confirmPassword).subscribe({
      next: response => {
        this.processing = false;
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'You can now log in with your new password.',
        })
        setTimeout(() => {
          this.submitted = false;
          this.router.navigate(['/']);
        }
          , 2000);
      },
      error: error => {
        this.processing = false;
        this.submitted = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    }
    );


  }
}
