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
  providerList: any;
  isLoading: boolean = false;
  user: any;
  VisitingCharge: any = 0;
  ProviderId: string = sessionStorage.getItem('id')!;
  UserName: string = sessionStorage.getItem('username')!;
  minDate: string = '';
  minTime: string = '';
  specialisations: any;
  stripe: any;
  elements: any;
  card: any;

  constructor(private router: Router,private authService: AuthService, private appointmentService: AppointmentService, private stripeService: StripeService) {
    this.getProviderList();
  }

  ngOnInit(): void {
    this.getUser();
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

  getProviderList() {
    this.authService.getAllProvider().subscribe({
      next: data => {
        this.providerList = data;
      }
    })
  }

  getProviderBySpecialiasation(event :any){
    this.authService.getAllProviderBySpecialisationId(event.target.value).subscribe({
      next : (res)=>{
        this.providerList = res;
      }
    })
  }

  getAllSpecialisation(){
    this.authService.getAllSpecialisation().subscribe({
      next : (res)=>{
        this.specialisations = res;
      }
    })
  }

//   onSubmit() {
//     if(this.AppointmentForm.valid){
//       this.isLoading = true;
//     console.log(this.AppointmentForm.value)
//     this.appointmentService.addAppointment(this.AppointmentForm.value).subscribe({
//       next: (data) => {
//         this.isLoading = false;
//         alert(data.message)
//         this.router.navigate(['/login']); 
//       },
//       error: (err) => {
//         this.isLoading = false;
//         alert(err.message);
//       }
//     })
//   }
//   else{
//     this.AppointmentForm.markAllAsTouched();
//   }
// }

async onSubmit() {
  if (this.AppointmentForm.invalid || this.isLoading) return;

  this.isLoading = true;

  const paymentIntent = await this.stripeService.createPaymentIntent();

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
}

bookAppointment() {
  console.log('Appointment booked');
  this.isLoading = false;
  alert('Appointment successfully booked!');
}

}

