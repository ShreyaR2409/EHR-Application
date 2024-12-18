import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/Auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { Router } from '@angular/router'; 
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, MatSnackBarModule],
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

  constructor(private router: Router,private authService: AuthService, private appointmentService: AppointmentService, private snackBar: MatSnackBar) {
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

  AppointmentForm = new FormGroup({
    PatientId: new FormControl("", [Validators.required]),
    ProviderId: new FormControl(this.ProviderId, [Validators.required]),
    AppointmentDate: new FormControl("", [Validators.required]),
    AppointmentTime: new FormControl("", [Validators.required]),
    ChiefComplaint: new FormControl("", [Validators.required]),
    Fee: new FormControl(this.VisitingCharge, [Validators.required]),
  })

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
        alert(data.message);
        this.snackBar.open(
          data.message,
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          }
        );
        this.router.navigate(['/ProviderDashboard']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err.message,
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          }
        );
      }
    })
  }
  else{
    this.AppointmentForm.markAllAsTouched();
  }
}
}
