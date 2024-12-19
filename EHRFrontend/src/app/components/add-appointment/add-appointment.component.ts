import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/Auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})

export class AddAppointmentComponent implements OnInit {
  patientList: any;
  isLoading: boolean = false;
  user: any;
  VisitingCharge: any = 0;
  ProviderId: string = sessionStorage.getItem('id')!;
  UserName: string = sessionStorage.getItem('username')!;
  minDate: string = '';
  minTime: string = '';
  timeMin : string = ''; 

  constructor(private router: Router,private authService: AuthService, private appointmentService: AppointmentService,  private toastr: ToastrService) {
    this.getPatientList();
  }

  ngOnInit(): void {
    this.getUser();
    this.setMinDateTime();
  }

    setMinDateTime() {
      const currentDate = new Date();     
      this.minDate = currentDate.toISOString().split('T')[0];      
      currentDate.setHours(currentDate.getHours() + 1);
      this.minTime = currentDate.toISOString().split('T')[1].slice(0, 5); 
    }

  getUser() {
    this.authService.getUserByUsername(this.UserName).subscribe({
      next: (data) => {
        this.user = data;
        this.VisitingCharge = this.user.VisitingCharge || 0;
        this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split('T')[0]; 

    if (selectedDate === today) {
      const currentTime = new Date();
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      this.timeMin = `${hours}:${minutes}`;
    } else {
      this.timeMin = '00:00'; 
    }
  }

  
  AppointmentForm = new FormGroup({
    PatientId: new FormControl("", [Validators.required]),
    ProviderId: new FormControl(this.ProviderId, [Validators.required]),
    AppointmentDate: new FormControl("", [Validators.required]),
    AppointmentTime: new FormControl("", [Validators.required]),
    ChiefComplaint: new FormControl("", [Validators.required]),
    Fee: new FormControl(this.VisitingCharge, [Validators.required]),
  })

  isTimeValid(): boolean {
    const selectedDate = new Date(this.AppointmentForm.value.AppointmentDate!);
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const selectedTime = this.AppointmentForm.value.AppointmentTime!;
      const currentTime = today.getHours() + today.getMinutes() / 60;
      const selectedTimeValue = parseInt(selectedTime.split(':')[0]) + parseInt(selectedTime.split(':')[1]) / 60;
      return selectedTimeValue > currentTime + 1;
    }
    return true;
  }

  getPatientList() {
    this.authService.getAllPatient().subscribe({
      next: data => {
        this.patientList = data;
      }
    })
  }

  onSubmit() {
    if(this.AppointmentForm.valid){
      this.isLoading = true;
    console.log(this.AppointmentForm.value)
    this.appointmentService.addAppointment(this.AppointmentForm.value).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.toastr.success(data.message, 'Success');
        this.router.navigate(['/ProviderDashboard']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.message, 'Error');
      }
    })
  }
  else{
    this.AppointmentForm.markAllAsTouched();
  }
}
}
