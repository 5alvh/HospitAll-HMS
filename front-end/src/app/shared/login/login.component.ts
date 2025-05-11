import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NgIf, ReactiveFormsModule, NgClass, RouterLink],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  processing = false;
  loginSuccess = false;
  loginError = false;
  errorMessage = '';
  passwordVisible = false;

  constructor(
    private localStorageManager: LocalStorageManagerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.localStorageManager.getToken();
    if (token) {
      this.router.navigate(['/dashboard-client']);
      return;
    }
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.invalid) {
      const firstElementWithError = document.querySelector('.ng-invalid');
      if (firstElementWithError) {
        firstElementWithError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.processing = true;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe).subscribe({
      next: response => {
        this.localStorageManager.setToken(response.token);
        setTimeout(() => {
          console.log('Login successful');
          this.processing = false;
          this.loginSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/dashboard-client']);
          }, 2000);
        }, 1500);
      },
      error: error => {
        setTimeout(() => {
          console.error('Login error:', error);
          this.processing = false;
          this.loginError = true;
          this.errorMessage = error?.error?.message || 'Invalid email or password. Please try again.';
        }, 1500);
      }
    });
  }
  get f() { return this.loginForm.controls; }
}