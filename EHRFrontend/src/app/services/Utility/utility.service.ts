import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  private url = 'https://localhost:7015/api/Utility';
  constructor(private http: HttpClient) { }

  public getAllCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/Country`);
  }

  public getStatesByCountryId(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/State?id=${countryId}`);
  }

  public getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/Roles`);
  }

  public getAllGenders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/Gender`);
  }

  public getAllBloodGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/BloodGroup`);
  }

  public getAllSpecialisations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/Specialisation`);
  }
}
