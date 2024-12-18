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

  updateAppointment(status: any): Observable<any> {
    return this.http.put(`${this.url}/UpdateAppointment`, status);
  }

  AppointmentCompleted(id : number): Observable<any>{
    return this.http.post(`${this.url}/MarkAsComplete?AppointmentId=${id}`,null);
  }

  AppointmentCancelled(id : number): Observable<any>{
    return this.http.post(`${this.url}/MarkAsCancelled?AppointmentId=${id}`,null);
  }

  GetAppointmentById(id: number): Observable<any>{
    return this.http.get(`${this.url}/AppointmentDetails?Id=${id}`);
  }

  AddSoapNote(appointmentData: any): Observable<any> {
    return this.http.post(`${this.url}/SoapNote`, appointmentData);
  }

  getSoapNotes(appointmentId : Number): Observable<any>{
    return this.http.get(`${this.url}/SoapNote?id=${appointmentId}`);
  }
}
