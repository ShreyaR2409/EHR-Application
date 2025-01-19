import { Component, inject, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { firebaseConfig } from '../../firebase-config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);

  senderId: string = '';
  receiverId: string = '';
  message: string = '';
  messages: any[] = [];

  // Send a message to Firebase
  sendMessage(): void {
    if (!this.message.trim() || !this.senderId || !this.receiverId) return;

    const messageData = {
      senderId: this.senderId,
      message: this.message.trim(),
      timestamp: Date.now(),
    };

    // Save message for the sender
    const senderRef = ref(db, `messages/${this.senderId}_${this.receiverId}`);
    const newSenderMessageRef = push(senderRef);
    set(newSenderMessageRef, messageData);

    // Save message for the receiver
    const receiverRef = ref(db, `messages/${this.receiverId}_${this.senderId}`);
    const newReceiverMessageRef = push(receiverRef);
    set(newReceiverMessageRef, messageData);

    // Clear the input field
    this.message = '';
  }

  // Listen for messages in real-time
  listenForMessages(): void {
    if (!this.senderId || !this.receiverId) return;

    const messageRef = ref(db, `messages/${this.senderId}_${this.receiverId}`);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.messages = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
      }
    });
  }

  ngOnInit() {
    this.senderId = sessionStorage.getItem('id') || ''; // Get the current user ID from session storage
    this.route.paramMap.subscribe((params) => {
      this.receiverId = params.get('receiverId') || ''; // Get the receiver ID from route parameters

      if (this.senderId && this.receiverId) {
        this.listenForMessages(); // Start listening for messages
      }
    });
  }
}
