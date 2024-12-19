import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { AuthService } from '../../services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import {  Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements AfterViewInit, OnInit {
  Role: string = sessionStorage.getItem('role')!;
  User: string = sessionStorage.getItem('id')!;
  UserId: number = 0;
  ProviderId: any;
  appointments: any[] = [];
  filteredAppointments : any[] = [];
  isLoading: boolean = false;
  isModalOpen: boolean = true;
  selectedAppointment: any = {}; 
  modal: Modal | undefined;
  confirmationModal: any;
  selectedStatus = 'Scheduled';
  minDate: string = '';
  minTime: string = '';
  timeMin : string = ''; 

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.GetAllAppointment();
  }

  ngOnInit(): void {
    this.setMinDateTime();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('editAppointmentModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }

    const confirmationModalElement = document.getElementById('confirmationModal');
    if (confirmationModalElement) {
      this.confirmationModal = new Modal(confirmationModalElement);
    }
  }

  setMinDateTime() {
    const currentDate = new Date();     
    this.minDate = currentDate.toISOString().split('T')[0];      
    currentDate.setHours(currentDate.getHours() + 1);
    this.minTime = currentDate.toISOString().split('T')[1].slice(0, 5); 
  }

  GetAllAppointment() {
    this.UserId = Number(this.User);
    this.appointmentService.getAppointments(this.Role, this.UserId).subscribe({
      next: (res) => {
        this.appointments = res
        console.log(this.appointments);
        this.filteredAppointments = this.appointments;
        this.filterAppointments();
      },
      error: (err) => {
        this.toastr.error(err.message , 'error');
      }
    })
  }

  filterAppointments(): void {
    if (this.selectedStatus) {
      this.filteredAppointments = this.appointments.filter(
        (appointment) => appointment.appointmentStatus === this.selectedStatus
      );
    } else {
      this.filteredAppointments = this.appointments; 
    }
  }

  get formattedAppointmentDate(): string {
    if (this.selectedAppointment.appointmentDate) {
      const date = new Date(this.selectedAppointment.appointmentDate);
      return date.toISOString().split('T')[0];
    }
    return '';
  }

  
  onDateChange(event: any) {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split('T')[0]; 

    if (selectedDate === today) {
      // If today is selected, set the time min to current time
      const currentTime = new Date();
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      this.timeMin = `${hours}:${minutes}`;
    } else {
      this.timeMin = '00:00'; // Reset timeMin to allow any time for future dates
    }
  }

  isTimeValid(): boolean {
    const selectedDate = new Date(this.selectedAppointment.value.AppointmentDate!);
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const selectedTime = this.selectedAppointment.value.AppointmentTime!;
      const currentTime = today.getHours() + today.getMinutes() / 60;
      const selectedTimeValue = parseInt(selectedTime.split(':')[0]) + parseInt(selectedTime.split(':')[1]) / 60;
      return selectedTimeValue > currentTime + 1;
    }
    return true;
  }


  getStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'badge bg-primary';
      case 'Completed':
        return 'badge bg-success';
      case 'Cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  openConfirmationModal(appointment: any) {
    this.selectedAppointment = { ...appointment }; 
    if (this.confirmationModal) {
      this.confirmationModal.show(); 
    }
  }
 
  closeConfirmationModal() {
    if (this.confirmationModal) {
      this.confirmationModal.hide();
    }
  }

  confirmCancelAppointment() {
    this.isLoading = true;
    this.appointmentService.AppointmentCancelled(this.selectedAppointment.id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success(res.message , 'Success');
        this.GetAllAppointment();
        this.closeConfirmationModal(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.message , 'error');
        this.closeConfirmationModal(); 
      }
    });
  }

 openEditModal(appointment: any) {
    this.selectedAppointment = { ...appointment };
    if (this.selectedAppointment.appointmentDate) {
      this.selectedAppointment.formattedAppointmentDate = this.selectedAppointment.appointmentDate.split('T')[0];
    }
    if (this.modal) {
      this.modal.show();
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();  
    }
  }

  saveChanges() {
    this.selectedAppointment.appointmentId = this.selectedAppointment.id;
    const formattedDate = new Date(this.selectedAppointment.formattedAppointmentDate);
    this.selectedAppointment.appointmentDate = formattedDate.toISOString().split('T')[0];
    delete this.selectedAppointment.id; 
    this.isLoading = true;
    this.appointmentService.updateAppointment(this.selectedAppointment).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success(res.message , 'Success');
        this.GetAllAppointment(); 
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.message , 'error');
      }
    });
  }
}

