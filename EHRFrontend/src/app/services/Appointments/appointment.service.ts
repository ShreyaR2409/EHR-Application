import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private url ='https://localhost:7015/api/Appointment';
  constructor(private http: HttpClient) { }

  addAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.url}/AddAppointment`, appointmentData);
  }

  getAppointments(role: string, userId: number): Observable<any> {
    return this.http.get(`${this.url}/user/${userId}?role=${role}`);
  }

  updateAppointmentStatus(status: any): Observable<any> {
    return this.http.put(`${this.url}/UpdateAppointment`, status);
  }

  AppointmentCompleted(id : number): Observable<any>{
    return this.http.post(`${this.url}/MarkAsComplete?AppointmentId=${id}`,null);
  }

}
