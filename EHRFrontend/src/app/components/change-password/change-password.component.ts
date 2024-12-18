import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  userId: string = sessionStorage.getItem('id') || ''; 
  constructor(private authService: AuthService, private router: Router) {}

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; 
    return passwordPattern.test(password);
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
    

    this.authService.changePassword(requestBody).subscribe(
      response => {
        alert('Password changed successfully');
        this.router.navigate(['/profile']);
      },
      error => {
        alert('Error: ' + error.message);
      }
    );
  }
}