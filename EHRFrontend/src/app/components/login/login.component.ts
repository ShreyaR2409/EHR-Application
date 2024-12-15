import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  Role: string = '';
  private storedUsername: string | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.Role = sessionStorage.getItem('Role')!;
  }

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required]),
  });

  forgotPasswordForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
  });

  get Email(): FormControl {
    return this.loginForm.get('userName') as FormControl;
  }

  loginSubmitted() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.isLoading = true;
  
      this.authService.loginUser(user).subscribe({
        next: (res) => {
          this.isLoading = false;
  
          if (res.status === 401) {
            this.snackBar.open(res.message, 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
            return; 
          }
  
          if (res.status === 200) {
            this.storedUsername = user.userName || null;
  
            const otpModalElement = document.getElementById('otpModal');
            if (otpModalElement) {
              const otpModal = new bootstrap.Modal(otpModalElement);
              otpModal.show();
            }
  
            // Show success snackbar after OTP modal is triggered
            this.snackBar.open(
              'OTP has been sent to the registered email address',
              'Close',
              {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
              }
            );
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error during login', err);
  
          this.snackBar.open('Invalid Username or Password', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  

  submitOtp() {
    if (this.otpForm.valid && this.storedUsername) {
      const otpData = {
        otp: this.otpForm.value.otp,
        username: this.storedUsername,
      };

      this.authService.verifyOtp(otpData).subscribe({
        next: (res) => {
          this.snackBar.open('OTP Verified Successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.authService.loadCurrentUser();
          // this.router.navigateByUrl('home');
          this.closeOtpModal();
        },
        error: (err) => {
          console.error('Error during OTP verification', err);
          this.snackBar.open(
            'OTP verification failed. Please try again.',
            'Close',
            {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            }
          );
        },
      });
    }       else {
        this.otpForm.markAllAsTouched();
      }
  }

  openForgotPasswordModal() {
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  submitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.Email;
      this.isLoading = true;
      this.authService.forgotPassword(email).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('New Password has been sent to your email.');
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error during password reset', err);
          alert('An error occurred. Please try again later.');
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  closeForgotPasswordModal() {
    const forgotPasswordModalElement = document.getElementById(
      'forgotPasswordModal'
    );
    if (forgotPasswordModalElement) {
      const forgotPasswordModalInstance = bootstrap.Modal.getInstance(
        forgotPasswordModalElement
      );
      forgotPasswordModalInstance?.hide();
    }
  }

  closeOtpModal() {
    const otpModalElement = document.getElementById('otpModal');
    if (otpModalElement) {
      const otpModalInstance = bootstrap.Modal.getInstance(otpModalElement);
      otpModalInstance?.hide();
    }
  }

  NavigateToRegister() {
    if (this.Role == 'Patient') {
      this.router.navigateByUrl('PatientRegistration');
    } else {
      this.router.navigateByUrl('ProviderRegistration');
    }
  }
}
