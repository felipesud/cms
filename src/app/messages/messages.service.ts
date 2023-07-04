import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { ContactsService } from '../contacts/contacts.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messageChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  message: Message;
  maxMessageId: number;

  constructor(
    private http: HttpClient,
    private contactsService: ContactsService
  ) {}

  setMessages(messages: Message[]) {
    this.messages = messages;
    this.messageChangedEvent.next(this.messages.slice());
  }

  getMessages(): Message[] {
    this.http
      .get<Message[]>('http://127.0.0.1:3000/messages')
      .pipe(
        map((responseData) => {
          const messages: Message[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              messages.push({ ...responseData[key], id: key });
            }
          }
          return messages;
        })
      )
      .subscribe({
        next: (n) => {
          this.messages = n;
          this.messages.sort((a: Message, b: Message) => +a.id - +b.id);
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (e) => console.error(e),
        complete: () => {
          this.messages;
        },
      });
    return this.messages;
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = Number(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; data: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        console.log(responseData);
        this.messages.push(responseData.data);
        this.messages = this.getMessages();
      });
  }
}
