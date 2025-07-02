import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { AuthService } from '../../services/auth/auth.service';
import { RouterService } from '../../services/auth/router.service';
import { Roles } from '../../models/roles';

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
    private router: Router,
    private routingService: RouterService
  ) { }

  ngOnInit(): void {
    this.checkRole();
    this.initForm();
  }
  signInWithGoogle() {
    console.log('Google sign in');
    // Add Google OAuth logic
  }

  signInWithFacebook() {
    console.log('Facebook sign in');
    // Add Facebook OAuth logic
  }

  signInWithLinkedIn() {
    console.log('LinkedIn sign in');
    // Add LinkedIn OAuth logic
  }
  checkRole(): void {
    const role = this.localStorageManager.getUserData();
    const token = this.localStorageManager.getToken();

    if (!token || !role) {
      this.localStorageManager.clearAuth();
      return;
    } else {
      if (role === Roles.ROLE_PATIENT) {
        console.log('ROLE_PATIENT');
        this.router.navigate(['/dashboard-client/']);
      } else if (role === Roles.ROLE_DOCTOR) {
        this.router.navigate(['/dashboard-doctor']);
      }
    }
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
        const role = response.role;
        setTimeout(() => {
          console.log('Login successful');
          this.processing = false;
          this.loginSuccess = true;
          this.routingService.routeUserByRole(role);
        }, 1500);
      },
      error: error => {
        setTimeout(() => {
          console.error('Login error:', error);
          this.processing = false;
          this.loginError = true;
          this.errorMessage = error?.error?.error || 'Invalid email or password. Please try again.';
        }, 1500);
      }
    });
  }
  get f() { return this.loginForm.controls; }

}