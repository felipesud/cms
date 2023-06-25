import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription: Subscription;

  constructor(private messageService: MessageService) {}

  // Lifecycle hook/method
  ngOnInit() {
    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        if (Array.isArray(messages)) {
          this.messages = messages;
        } else {
          console.error('Error retrieving messages: ', messages);
        }
      }
    );
    this.messageService.getMessages();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
