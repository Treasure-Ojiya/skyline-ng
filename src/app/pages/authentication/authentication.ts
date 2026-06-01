import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/authService/auth-service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.css'],
})
export class Authentication {
  isLogin = true;
  loader = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9+\-() ]{7,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    address: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showLoginForm() {
    this.isLogin = true;
    this.errorMessage = '';
  }

  showRegisterForm() {
    this.isLogin = false;
    this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    const { email, password } = this.loginForm.value as { email: string; password: string };

    this.authService.loginUser({ email, password }).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.result) {
          this.router.navigate(['/application/home']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please check your credentials.';
        }
      },
      error: () => {
        this.loader = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      },
    });
  }

  onRegister() {
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    const formValue = this.registerForm.value as any;

    this.authService.registerUser(formValue).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.result) {
          this.router.navigate(['/application/home']);
        } else {
          this.errorMessage = res.message || 'Registration failed. Please try again.';
        }
      },
      error: () => {
        this.loader = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      },
    });
  }
}
