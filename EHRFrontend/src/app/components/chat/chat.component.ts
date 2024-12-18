import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/Chats/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  patientId = 'patient1';
  providerId = 'provider1';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService
      .getChatHistory(this.patientId, this.providerId)
      .subscribe((messages: any) => (this.messages = messages));
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        sender: this.patientId,
        receiver: this.providerId,
        message: this.newMessage,
      };
      this.chatService.sendMessage(message).subscribe(() => {
        this.messages.push(message);
        this.newMessage = '';
      });
    }
  }
}