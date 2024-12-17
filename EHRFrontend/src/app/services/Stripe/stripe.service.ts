import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'https://localhost:7015/api/Payment/create-payment-intent'; // Backend API URL

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number) {
    return this.http.post<any>(`${this.baseUrl}`, { amount }).toPromise();
  }
}
