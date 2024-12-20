import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordsMismatch: boolean = false;
  invalidPassword: boolean = false;
  isLoading = false;
  userId: string = sessionStorage.getItem('id') || ''; 
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; 
    return passwordPattern.test(password);
  }

  onPasswordChange() {
    this.passwordsMismatch = false;
    this.invalidPassword = false;
  }

  onSubmit() {
    this.passwordsMismatch = false;
    this.invalidPassword = false;
    if (this.newPassword !== this.confirmPassword) {
      this.passwordsMismatch = true;
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.invalidPassword = true;
      return;
    }


    const requestBody = {
      UserId: this.userId,  
      NewPassword: this.newPassword
    };
    
    this.isLoading =  true;
    this.authService.changePassword(requestBody).subscribe(
      response => {
        this.isLoading = false;
        this.toastr.success('Password changed successfully', 'Success');
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error.message, 'Error');

      }
    );
  }
}