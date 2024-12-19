import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-go-to-appointment',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './go-to-appointment.component.html',
  styleUrl: './go-to-appointment.component.css'
})

export class GoToAppointmentComponent implements OnInit, AfterViewInit{
  private route = inject(ActivatedRoute);
  productId!: string;
  userDetail: any;
  isloading = false;
  notes: any;
  soapNotesModal : any;
  constructor(private routes: ActivatedRoute, private appointmentService: AppointmentService, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id')!;
      console.log(this.productId);
      this.soapNoteForm.get('appointmentId')?.setValue(this.productId);
    });
    this.GetDetails();
    this.GetSoapNote();
  }

    ngAfterViewInit(): void {
      const SoapNoteModelEle = document.getElementById('soapNotesModal');
      if (SoapNoteModelEle) {
        this.soapNotesModal = new Modal(SoapNoteModelEle);
      }
    }
  

  showSoapForm = false;

  soapNoteForm = new FormGroup({
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
    if (this.soapNotesModal) {
      this.soapNotesModal.hide();
    }
  }

  submitSoapNotes() {
    console.log(this.soapNoteForm.value);
    if (this.soapNoteForm.valid) {
      const user = this.soapNoteForm.value;
      this.isloading = true;
      this.appointmentService.AddSoapNote(user).subscribe({
        next: (res) => {
          const AppointmentId = Number(this.productId);
          this.appointmentService.AppointmentCompleted(AppointmentId).subscribe({
            next: (res) => {
              this.toastr.success(res.message, 'Success');
              this.GetDetails();
              this.GetSoapNote();
              this.closeSoapNotesForm()
            },
            error: (err) => {
              this.toastr.error(err.message, 'Error');

            }
          })
          this.toastr.success(res.message, 'Success');
          const soapNotesModal = new bootstrap.Modal(document.getElementById('soapNotesModal')!);
          soapNotesModal.hide();
        },
        error: (err) => {
          this.toastr.success(err.message, 'Success');          
        const soapNotesModal = new bootstrap.Modal(document.getElementById('soapNotesModal')!);
        soapNotesModal.hide();
        }
      })
    }
    else {
      this.soapNoteForm.markAllAsTouched();
    }
    this.showSoapForm = false;
  }

  GetDetails() {
    const AppointmentId = Number(this.productId);
    this.appointmentService.GetAppointmentById(AppointmentId).subscribe({
      next: (res) => {
        this.userDetail = res;
      },
      error: (err) => {
        // alert(err);
        this.toastr.success(err.message, 'Success');
      }
    })
  }

  GetSoapNote() {
    const AppointmentId = Number(this.productId);
    this.appointmentService.getSoapNotes(AppointmentId).subscribe({
      next: (res) => {
        this.notes = res;
        console.log(this.notes);

      }
    })
  }
}
