import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-go-to-appointment',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './go-to-appointment.component.html',
  styleUrl: './go-to-appointment.component.css'
})
export class GoToAppointmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productId!: string;
  userDetail : any;
  constructor(private routes: ActivatedRoute, private appointmentService : AppointmentService) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id')!;
      console.log(this.productId );      
    });
    this.GetDetails();
  }

  GetDetails(){
    const AppointmentId = Number(this.productId);
    this.appointmentService.GetAppointmentById(AppointmentId).subscribe({
      next : (res)=>{
        this.userDetail = res;
        console.log(this.userDetail);
        
      },
      error:(err)=>{
        alert(err);
      }
    })
  }

  confirmAppointment() {
    alert('Appointment Confirmed');
  }

  cancelAppointment() {
    alert('Appointment Canceled');
  }
}
