import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent {
  Role: string = sessionStorage.getItem('role')!;
  User: string = sessionStorage.getItem('id')!;
  UserId : number = 0;
  appointments: any[] = [];
  isLoading: boolean = false;
  constructor(private appointmentService : AppointmentService){
    this.GetAllAppointment();
  }

  GetAllAppointment(){
    this.UserId = Number(this.User);
    this.appointmentService.getAppointments(this.Role , this.UserId).subscribe({
      next : (res)=>{
        this.appointments = res
      },
      error : (err)=>{
        alert(err.message);
      }
    })
  }

    // Function to get the CSS class for appointment status
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

  // Example method for viewing appointment details
  viewDetails(appointment: any) {
    alert(`Viewing details for appointment ID: ${appointment.id}`);
  }

  // Example method for rescheduling an appointment
  rescheduleAppointment(appointment: any) {
    alert(`Rescheduling appointment ID: ${appointment.id}`);
  }
}
