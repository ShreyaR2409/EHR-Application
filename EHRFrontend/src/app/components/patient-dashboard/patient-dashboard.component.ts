import { Component, AfterViewInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { AuthService } from '../../services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import {  Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements AfterViewInit {
  Role: string = sessionStorage.getItem('role')!;
  User: string = sessionStorage.getItem('id')!;
  UserId: number = 0;
  ProviderId: any;
  appointments: any[] = [];
  isLoading: boolean = false;
  isModalOpen: boolean = true;
  selectedAppointment: any = {}; 
  modal: Modal | undefined;
  confirmationModal: any;
  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.GetAllAppointment();
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


  GetAllAppointment() {
    this.UserId = Number(this.User);
    this.appointmentService.getAppointments(this.Role, this.UserId).subscribe({
      next: (res) => {
        this.appointments = res
        console.log(this.appointments);
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }

  get formattedAppointmentDate(): string {
    if (this.selectedAppointment.appointmentDate) {
      const date = new Date(this.selectedAppointment.appointmentDate);
      return date.toISOString().split('T')[0];
    }
    return '';
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
    this.appointmentService.AppointmentCancelled(this.selectedAppointment.id).subscribe({
      next: (res) => {
        alert(res.message);
        this.GetAllAppointment();
        this.closeConfirmationModal(); 
      },
      error: (err) => {
        alert(err.message);
        this.closeConfirmationModal(); 
      }
    });
  }

 openEditModal(appointment: any) {
    this.selectedAppointment = { ...appointment };
    if (this.modal) {
      this.modal.show();  
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();  
    }
  }

 
  EditDetails(appointment: any) {
    alert(`Edit Appointment: ${appointment.id}`);
  }

  saveChanges() {
    this.selectedAppointment.appointmentId = this.selectedAppointment.id;
    this.selectedAppointment.appointmentDate = this.selectedAppointment.formattedAppointmentDate;
    delete this.selectedAppointment.id; 
    this.appointmentService.updateAppointment(this.selectedAppointment).subscribe({
      next: (res) => {
        alert(res.message);
        this.GetAllAppointment(); 
        this.closeModal();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  // CancelAppointment(appointment: number) {
  //  this.appointmentService.AppointmentCancelled(appointment).subscribe({
  //   next : (res) =>{
  //     alert(res.message);
  //   },
  //   error : (err)=>{
  //     alert(err.message);
  //   }
  //  })
  // }
}

