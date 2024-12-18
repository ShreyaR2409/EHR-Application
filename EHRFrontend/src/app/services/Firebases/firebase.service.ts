import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private messaging: Messaging) {}

  requestPermission(): void {
    getToken(this.messaging, { vapidKey: 'AIzaSyAyTFKUAjrJAo9835nGcDRIJKPUJgAug0M' })
      .then((token) => {
        if (token) {
          console.log('Token received:', token);
        }
      })
      .catch((err) => console.error('Permission denied:', err));
  }

  listen(): Observable<any> {
    return new Observable((observer) => {
      onMessage(this.messaging, (payload) => observer.next(payload));
    });
  }
}
