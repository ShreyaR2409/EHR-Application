import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'; 
import { throwError } from 'rxjs'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('authToken');

  // Add the Authorization header if token exists
  const modifiedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(modifiedReq).pipe(
    catchError((error) => {
      // Handle unauthorized (401) or forbidden (403) errors
      if (error.status === 401 || error.status === 403) {
        const router = inject(Router); // Use inject() for Router in a functional context
        sessionStorage.clear(); // Clear the session
        router.navigate(['/login']); // Redirect to login page
      }
      return throwError(() => new Error(error.message));
    })
  );
};
