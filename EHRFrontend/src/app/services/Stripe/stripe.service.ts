import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:5000/api/payment'; // Backend API URL

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number) {
    return this.http.post<any>(`${this.baseUrl}/create-payment-intent`, { amount }).toPromise();
  }
}
