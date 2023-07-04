import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Message } from '../message.model';
import { MessagesService } from '../messages.service';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactsService } from 'src/app/contacts/contacts.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  currentSender: Contact;

  constructor(
    private messageService: MessagesService,
    private contactService: ContactsService
  ) {}

  ngOnInit() {
    this.contactService.getContactId('101').subscribe((response) => {
      this.currentSender = response.contact;
    });
  }

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;

    const message = new Message(
      '',
      subjectValue,
      msgTextValue,
      this.currentSender
    );

    this.messageService.addMessage(message);

    this.onClear();
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
}
