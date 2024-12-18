import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { CommonModule } from '@angular/common';
import { FormGroup,FormControl,Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-go-to-appointment',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './go-to-appointment.component.html',
  styleUrl: './go-to-appointment.component.css'
})
export class GoToAppointmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productId!: string;
  userDetail : any;
  isloading = false;
  notes : any;
  constructor(private routes: ActivatedRoute, private appointmentService : AppointmentService, private snackBar: MatSnackBar) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id')!;
      console.log(this.productId );
      this.soapNoteForm.get('appointmentId')?.setValue(this.productId);      
    });
    this.GetDetails();
    this.GetSoapNote();
  }

  showSoapForm = false;

  soapNoteForm =  new FormGroup({
    appointmentId: new FormControl('', [Validators.required]),
    subjective: new FormControl('', [Validators.required]),
    objective: new FormControl('', [Validators.required]),
    assessment: new FormControl('', [Validators.required]),
    plan: new FormControl('', [Validators.required]),
  })

  openSoapNotesForm() {
    this.showSoapForm = true;
  }

  closeSoapNotesForm() {
    this.showSoapForm = false;
  }

  submitSoapNotes() {
    console.log(this.soapNoteForm.value);
    if(this.soapNoteForm.valid){
      const user = this.soapNoteForm.value;
      this.isloading= true;
      this.appointmentService.AddSoapNote(user).subscribe({
        next : (res)=>{
          const AppointmentId = Number(this.productId);
          this.appointmentService.AppointmentCompleted(AppointmentId).subscribe({
            next: (res)=>{
              alert(res.message);
              this.GetDetails();
            },
            error : (err)=>{
              alert(err.message);
            }
          })
          alert(res.message)
          this.showSoapForm = false;
          this.snackBar.open(res.message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
        },
        error : (err)=>{
          this.snackBar.open(err.message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
          this.showSoapForm = false;
        }
      })
    }
    else{
      this.soapNoteForm.markAllAsTouched();
    }
  }

  GetDetails(){
    const AppointmentId = Number(this.productId);
    this.appointmentService.GetAppointmentById(AppointmentId).subscribe({
      next : (res)=>{
        this.userDetail = res;        
      },
      error:(err)=>{
        alert(err);
      }
    })
  }

  GetSoapNote(){
    const AppointmentId = Number(this.productId);
    this.appointmentService.getSoapNotes(AppointmentId).subscribe({
      next : (res) =>{
        this.notes = res;
        console.log(this.notes);
        
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
