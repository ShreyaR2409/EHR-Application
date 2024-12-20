// fcm.service.ts
import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Handle the foreground message here
    });
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'your-vapid-key' }).then((currentToken) => {
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Save the token to Firestore if needed
      } else {
        console.log('No FCM token available.');
      }
    });
  }
}
