import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://localhost:7015/api/User';

  private currentUserSubject = new BehaviorSubject<any>(null); 
  public currentUser = this.currentUserSubject.asObservable(); 

  constructor(private http: HttpClient, private router: Router) {}

  public registerUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, formData);
  }

  public loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, user).pipe(
      tap((response) => {
        if (response && response.token) {
          sessionStorage.setItem('authToken', response.token);
          this.loadCurrentUser();
          this.redirectUserBasedOnRole();
        }
      })
    );
  }

  public verifyOtp(otp: any): Observable<any> {
    return this.http.post<any>(`${this.url}/VerifyOtp`, otp).pipe(
      tap((response) => {
        if (response && response.token) {
          sessionStorage.setItem('authToken', response.token);
          this.loadCurrentUser();
          this.redirectUserBasedOnRole();

        }
      })
    );
  }

  public forgotPassword(email: any): Observable<string> {
    return this.http.post<string>(`${this.url}/ForgotPassword?Email=${email}`, {
      responseType: 'text' as 'json'
    });
  }
  
  public updateUser(userId: number, userData: FormData): Observable<any> {
    return this.http.put(`${this.url}/UpdateUser/${userId}`, userData).pipe(
      tap((response) => {
        this.currentUserSubject.next(response);
      })
    );
  }

  public changePassword(requestBody: { UserId: string, NewPassword: string }): Observable<any> {
    return this.http.put(`${this.url}/ChangePassword`, requestBody); 
  }

  public getUserByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetUserByUsername?username=${username}`);
  }

  public getUserById(Id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/UserName?id=${Id}`);
  }

  public getAllPatient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/PatientList`);
  }

  public getAllSpecialisation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/AllSpecialisation`);
  }

  public getAllProvider(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ProviderList`);
  }

  public getAllProviderBySpecialisationId(Id : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ProviderBySpecialisation?id=${Id}`);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  public loadCurrentUser(): void {
    // sessionStorage.clear();
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      const userData = {
        username:
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ],
        role: decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ],
        id: decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ],
      };
      this.currentUserSubject.next(userData);
      sessionStorage.setItem('username', userData.username || '');
      sessionStorage.setItem('role', userData.role || '');
      sessionStorage.setItem('id', userData.id || '');
    }
  }

  private redirectUserBasedOnRole(): void {
    const role = sessionStorage.getItem('role');

    if (role === 'Provider') {
      this.router.navigate(['/ProviderDashboard']);
    } else if (role === 'Patient') {
      this.router.navigate(['/PatientDashboard']);
    } else {
      this.router.navigate(['/unauthorized']); 
    }
  }

  public isLoggedIn(): boolean {
    const token = sessionStorage.getItem('authToken');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = this.decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  public logoutUser(): void {
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/Login']);
  }
}
