import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{Modal} from 'bootstrap';
import {NavbarComponent} from '../navbar/navbar.component'; 
import { AuthService } from '../../services/Auth/auth.service'; // Adjust path as needed
// import { ToastrService } from 'ngx-toastr'; // For notifications (optional)

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent{
  username: string;
  user: any = {
    FirstName: '',
    LastName: '',
    Email: '',
    UserTypeId: 0,
    Dob: '',
    PhoneNumber: '',
    Address: '',
    Pincode: '',
    CountryId: 0,
    StateId: 0,
    ProfileImage: null,
  };

  constructor(private authService: AuthService) {
    this.username = sessionStorage.getItem('username') ?? '';
    this.getUser();
  }

  getUser() {
    this.authService.getUserByUsername(this.username).subscribe((data) => {
      this.user = data;
    });
  }

  toggleEditMode() {
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const modal = new Modal(modalElement); 
      modal.show();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.ProfileImage = file;
    }
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('FirstName', this.user.FirstName);
    formData.append('LastName', this.user.LastName);
    formData.append('Email', this.user.Email);
    formData.append('UserTypeId', this.user.UserTypeId.toString());
    formData.append('Dob', this.user.Dob);
    formData.append('PhoneNumber', this.user.PhoneNumber);
    formData.append('Address', this.user.Address);
    formData.append('Pincode', this.user.Pincode);
    formData.append('CountryId', this.user.CountryId.toString());
    formData.append('StateId', this.user.StateId.toString());

    if (this.user.ProfileImage) {
      formData.append('ProfileImage', this.user.ProfileImage, this.user.ProfileImage.name);
    }

    this.authService.updateUser(this.user.id, formData).subscribe(
      (response) => {
        console.log('Profile updated successfully', response);

        const modalElement = document.getElementById('editProfileModal');
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      },
      (error) => {
        console.error('Error updating profile', error);
      }
    );
  }

  Logout() {
    this.authService.logoutUser();
  }
}