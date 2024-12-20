import { Component, inject, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, child, push } from 'firebase/database';
import { firebaseConfig } from '../../firebase-config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  receiverId: string = '';
  message: string = '';
  messages: any[] = [];
  senderId: string = '';
  receiver: string = '';

  sendMessage(receiverId: string, message: string): void {
    const messageRef = ref(db, 'messages/' + receiverId + sessionStorage.getItem('id'));
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      senderId: sessionStorage.getItem('id'),
      message: message,
      timestamp: Date.now(),
    });

    const SmessageRef = ref(db, 'messages/' + sessionStorage.getItem('id') + receiverId);
    const SnewMessageRef = push(SmessageRef);
    set(SnewMessageRef, {
      receiverId: receiverId,
      message: message,
      timestamp: Date.now(),
    });
  }

  listenForMessages(receiverId: string): void {
    const messageRef = ref(db, 'messages/' + sessionStorage.getItem('id') + receiverId);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.messages = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
      }
    });
  }

  ngOnInit() {
    this.senderId = sessionStorage.getItem('id') || ''; 
    this.route.paramMap.subscribe((params) => {
      this.receiver = params.get('receiverId')!;
      this.receiverId = this.receiver; 
      console.log(this.receiver);  
      console.log("Receiver ID:", this.receiver);
      console.log("Sender ID:", this.senderId);
      this.listenForMessages(this.receiver); 
      this.listenForMessages(this.senderId); 
    });
  }
}
