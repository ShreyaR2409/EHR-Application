import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) { }

  // Create a payment intent on the backend
  createPaymentIntent() {
    return this.http.post<{ client_secret: string }>(`${environment.apiUrl}/create-payment-intent`, {}).toPromise();
  }
}
