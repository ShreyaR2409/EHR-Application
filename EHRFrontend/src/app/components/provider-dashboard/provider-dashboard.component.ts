import { Component, AfterViewInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent implements AfterViewInit  {
  Role: string = sessionStorage.getItem('role')!;
  User: string = sessionStorage.getItem('id')!;
  UserId: number = 0;
  appointments: any[] = [];
  filteredAppointments : any[] = [];
  isLoading: boolean = false;
  selectedAppointment: any = {};
  modal: Modal | undefined;
  confirmationModal: any;
  selectedStatus = 'Scheduled';

  constructor(private appointmentService: AppointmentService, private toastr: ToastrService) {
    this.GetAllAppointment();
  }

  ngAfterViewInit(): void {
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
        this.filteredAppointments = this.appointments;
        this.filterAppointments();
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }

  filterAppointments(): void {
    if (this.selectedStatus) {
      this.filteredAppointments = this.appointments.filter(
        (appointment) => appointment.appointmentStatus === this.selectedStatus
      );
    } else {
      this.filteredAppointments = this.appointments; // Show all if no status is selected
    }
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

  CancelAppointment() {
    this.isLoading = true;
    this.appointmentService.AppointmentCancelled(this.selectedAppointment.id).subscribe({
      next: (res) => {
        this.isLoading = false;
        const message = typeof res === 'string' ? res : res.message;
        this.toastr.success(message, 'Success');
        this.GetAllAppointment();
        this.closeConfirmationModal(); 
      },
      error : (err)=>{
        this.isLoading = false;
        this.toastr.error(err, 'Error');
      }
    })
  }

}
