import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/Auth/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { StripeService } from '../../services/Stripe/stripe.service';
import { ToastrService } from 'ngx-toastr';
declare var Stripe: any;

@Component({
  selector: 'app-add-appointment-patient',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-appointment-patient.component.html',
  styleUrl: './add-appointment-patient.component.css'
})
export class AddAppointmentPatientComponent implements OnInit {
  providerList: any[] = [];
  filteredProviderList: any[] = [];
  isLoading: boolean = false;
  user: any;
  VisitingCharge: any = 0;
  PatientId: string = sessionStorage.getItem('id')!;
  minDate: string = '';
  minTime: string = '';
  specialisations: any[] = [];
  selectedSpecialisation: any = null;
  timeMin : string = ''; 
  stripe: any;
  elements: any;
  card: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private stripeService: StripeService,
    private toastr: ToastrService
  ) {
    this.getProviderList();
  }

  ngOnInit(): void {
    this.AppointmentForm.reset();
    this.setMinDateTime();
    this.getAllSpecialisation();
    this.selectedSpecialisation = null;
    this.stripe = Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
    this.AppointmentForm.get('PatientId')?.setValue(this.PatientId);

  }

  setMinDateTime() {
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
    currentDate.setHours(currentDate.getHours() + 1);
    this.minTime = currentDate.toISOString().split('T')[1].slice(0, 5);
  }

  AppointmentForm = new FormGroup({
    PatientId: new FormControl(""),
    ProviderId: new FormControl("", [Validators.required]),
    AppointmentDate: new FormControl("", [Validators.required]),
    AppointmentTime: new FormControl("", [Validators.required]),
    ChiefComplaint: new FormControl("", [Validators.required]),
    Fee: new FormControl(this.VisitingCharge, [Validators.required]),
  });

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
      this.timeMin = '00:00'; 
    }
  }


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

  // Get all providers
  getProviderList() {
    this.authService.getAllProvider().subscribe({
      next: data => {
        this.providerList = data;
        this.filteredProviderList = data;
        // if (this.providerList && this.providerList.length > 0) {
        //   this.VisitingCharge = this.providerList[0].visitingCharge;
        //   this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
        // }
      }
    });
  }

  // Get providers filtered by specialisation
  getProviderBySpecialisation(event: any) {
    const selectedSpecialisationId = event.target.value;
    this.authService.getAllProviderBySpecialisationId(selectedSpecialisationId).subscribe({
      next: (res) => {
        this.filteredProviderList = res; // Update the filtered list of providers
      },
      error: (err) => {
        console.error('Error fetching providers by specialisation', err);
      }
    });
  }

  // Get all specialisations
  getAllSpecialisation() {
    this.authService.getAllSpecialisation().subscribe({
      next: (res) => {
        this.specialisations = res;
      },
      error: (err) => {
        console.error('Error fetching specialisations', err);
      }
    });
  }

  onProviderSelect(event: any) {
    const providerId = event.target.value;
    console.log('ProviderId:', providerId);
    console.log('Filtered Provider List:', this.filteredProviderList);
    const selectedProvider = this.filteredProviderList.find(provider => provider.userId === Number(providerId));
    console.log(selectedProvider);
    if (selectedProvider) {
      this.VisitingCharge = selectedProvider.visitingCharge;
      this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
    } else {
      this.VisitingCharge = 0;
      this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
    }
  }

  async onSubmit() {
    if (this.AppointmentForm.valid) {
      console.log(this.PatientId);
      console.log(this.AppointmentForm.value);
      if (this.AppointmentForm.invalid || this.isLoading) return;
      this.isLoading = true;
      const feeAmount = this.AppointmentForm.get('Fee')?.value;
      try {
        const paymentIntent = await this.stripeService.createPaymentIntent(feeAmount);
        const { error, paymentIntent: confirmedPaymentIntent } = await this.stripe.confirmCardPayment(
          paymentIntent?.client_secret,
          {
            payment_method: {
              card: this.card,
              billing_details: {
                name: 'Test User',
                email: 'test@example.com',
                address: { line1: '123 Main St', city: 'Test City', postal_code: '12345' }
              }
            }
          }
        );
        if (error) {
          console.error(error);
          this.isLoading = false;
          // alert('Payment failed: ' + error.message);
          this.toastr.error('Payment failed: ' + error.message, 'Error');

        } else if (confirmedPaymentIntent.status === 'succeeded') {
          this.bookAppointment();
        } else {
          this.isLoading = false;
          // alert('Payment failed');
          this.toastr.error('Payment failed', 'Error');

        }
      } catch (error) {
        console.error(error);
        // alert('Error processing payment');
        this.toastr.error('Error processing payment', 'Error');
        this.isLoading = false;
      }
    }
    else {
      this.AppointmentForm.markAllAsTouched();
    }
  }


  bookAppointment() {
    this.appointmentService.addAppointment(this.AppointmentForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status == 400) {
          this.toastr.error(res.message, 'Error');
        }
       else{
        this.toastr.success(res.message, 'Success');
        this.router.navigate(['/PatientDashboard']);
       }
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    })
  }
}