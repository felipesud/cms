import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(
    private http: HttpClient,
    private contactService: ContactService
  ) {}

  setMessages(messages: Message[]) {
    this.messages = messages;
    this.messageChangedEvent.next(this.messages.slice());
  }

  getMessages(): Message[] {
    this.http
      .get<Message[]>(
        'https://felipe-125b2-default-rtdb.firebaseio.com/messages.json'
      )
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
          this.maxMessageId = this.getMaxId();
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
    return this.messages.find((m) => m.id === id);
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

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    this.maxMessageId = this.getMaxId();
    this.maxMessageId++;

    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);

    this.storeMessages();
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders().set('Content-Type', 'application/Json');
    this.http
      .put(
        'https://felipe-125b2-default-rtdb.firebaseio.com/messages.json',
        messages,
        { headers }
      )
      .subscribe(() => {
        const cloneMessages = this.messages.slice();
        this.messageChangedEvent.next(cloneMessages);
      });
  }
}
