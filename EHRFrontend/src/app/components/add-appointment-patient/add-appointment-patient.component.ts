import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/Auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/Appointments/appointment.service';
import { Router } from '@angular/router'; 
import { environment } from '../../environment'; 
import { StripeService } from '../../services/Stripe/stripe.service';

declare var Stripe: any;

@Component({
  selector: 'app-add-appointment-patient',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './add-appointment-patient.component.html',
  styleUrl: './add-appointment-patient.component.css'
})
export class AddAppointmentPatientComponent implements OnInit {
  providerList: any[] = [];
  filteredProviderList: any[] = []; // List for providers filtered by selected specialisation
  isLoading: boolean = false;
  user: any;
  VisitingCharge: any = 0;
  PatientId: string = sessionStorage.getItem('id')!;
  minDate: string = '';
  minTime: string = '';
  specialisations: any[] = [];

  stripe: any;
  elements: any;
  card: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private stripeService: StripeService
  ) {
    this.getProviderList();
  }

  ngOnInit(): void {
    this.AppointmentForm.reset();
    this.setMinDateTime();
    this.getAllSpecialisation();
    this.stripe = Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  setMinDateTime() {
    const currentDate = new Date();     
    this.minDate = currentDate.toISOString().split('T')[0];      
    currentDate.setHours(currentDate.getHours() + 1);
    this.minTime = currentDate.toISOString().split('T')[1].slice(0, 5); 
  }

  AppointmentForm = new FormGroup({
    PatientId: new FormControl(this.PatientId, [Validators.required]),
    ProviderId: new FormControl("", [Validators.required]),
    AppointmentDate: new FormControl("", [Validators.required]),
    AppointmentTime: new FormControl("", [Validators.required]),
    ChiefComplaint: new FormControl("", [Validators.required]),
    Fee: new FormControl(this.VisitingCharge, [Validators.required]),
  });

  // Get all providers
  getProviderList() {
    this.authService.getAllProvider().subscribe({
      next: data => {
        this.providerList = data;
        this.filteredProviderList = data; // Initially show all providers
        if (this.providerList && this.providerList.length > 0) {
          this.VisitingCharge = this.providerList[0].visitingCharge;
          this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
        }
      }
    });
  }

  // Get providers filtered by specialisation
  getProviderBySpecialisation(event: any) {
    const selectedSpecialisationId = event.target.value;
    this.authService.getAllProviderBySpecialisationId(selectedSpecialisationId).subscribe({
      next: (res) => {
        this.filteredProviderList = res; // Update the filtered list of providers
        if (this.filteredProviderList && this.filteredProviderList.length > 0) {
          this.VisitingCharge = this.filteredProviderList[0].visitingCharge;
          this.AppointmentForm.get('Fee')?.setValue(this.VisitingCharge);
        }
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

  // Handle form submission
  async onSubmit() {
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
        alert('Payment failed: ' + error.message);
      } else if (confirmedPaymentIntent.status === 'succeeded') {
        this.bookAppointment();
      } else {
        this.isLoading = false;
        alert('Payment failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error processing payment');
      this.isLoading = false;
    }
  }

  // Function to book appointment
  bookAppointment() {
    console.log('Appointment booked');
    this.isLoading = false;
    alert('Appointment successfully booked!');
  }
}