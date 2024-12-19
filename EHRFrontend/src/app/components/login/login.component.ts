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
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private toastr: ToastrService
  ) {
    this.Role = sessionStorage.getItem('role')!;
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
            this.toastr.error(res.message , 'error');
            return;
          }

          if (res.status === 200) {
            this.storedUsername = user.userName || null;

            const otpModalElement = document.getElementById('otpModal');
            if (otpModalElement) {
              const otpModal = new bootstrap.Modal(otpModalElement);
              otpModal.show();
            }
            this.toastr.success('OTP has been sent to the registered email address', 'Success');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error during login', err);
          this.toastr.error('Invalid Username or Password', 'Error');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  submitOtp() {
    if (this.otpForm.valid && this.storedUsername) {
      this.isLoading = true;
      const otpData = {
        otp: this.otpForm.value.otp,
        username: this.storedUsername,
      };

      this.authService.verifyOtp(otpData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success('OTP Verified Successfully!', 'Success');
          this.authService.loadCurrentUser();
          this.closeOtpModal();
        },
        error: (err) => {
          console.error('Error during OTP verification', err);
          this.toastr.error('OTP verification failed. Please try again.', 'Error');
        },
      });
    } else {
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
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.Email;
      this.isLoading = true;
      this.authService.forgotPassword(email).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          const message = typeof res === 'string' ? res : res.message;
          if(res.status == 404){
            this.toastr.error(message, 'Error');
          }
          else{
            this.toastr.success(message, 'Sucess');
          }
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error("Error during password reset", 'Error');
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
    const role = sessionStorage.getItem('role');
  
    if (role) {
      this.redirectToRolePage(role);
    } else {
      const roleModalElement = document.getElementById('roleSelectionModal');
      if (roleModalElement) {
        const roleModal = new bootstrap.Modal(roleModalElement);
        roleModal.show();
      }
    }
  }
  
  selectRole(role: string) {
    sessionStorage.setItem('role', role);
  
    const roleModalElement = document.getElementById('roleSelectionModal');
    if (roleModalElement) {
      const roleModalInstance = bootstrap.Modal.getInstance(roleModalElement);
      roleModalInstance?.hide();
    }
  
    this.redirectToRolePage(role);
  }
  
  redirectToRolePage(role: string) {
    if (role === 'Patient') {
      this.router.navigate(['/PatientRegistration']);
    } else if (role === 'Provider') {
      this.router.navigate(['/ProviderRegistration']);
    } else {
      this.toastr.error('Invalid role selected', 'error');
    }
  }
  
}
