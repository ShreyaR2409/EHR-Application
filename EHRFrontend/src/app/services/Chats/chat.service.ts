import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'https://localhost:7015/api/Chat';

  constructor(private http: HttpClient) {}

  validateAppointment(patientId: string, providerId: string) {
    return this.http.get(`${this.apiUrl}/validate/${patientId}/${providerId}`);
  }

  sendMessage(message: any) {
    return this.http.post(`${this.apiUrl}/send`, message);
  }

  getChatHistory(patientId: string, providerId: string) {
    return this.http.get(`${this.apiUrl}/history/${patientId}/${providerId}`);
  }
}
