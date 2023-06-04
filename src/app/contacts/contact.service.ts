import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // contactSelectedEvent = new Subject<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  private contacts: Contact[] = [];
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    console.log('Getting all contacts.');
    return this.contacts
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      .slice();
  }

  getContact(id: string): Contact | null {
    console.log('Getting a contact.');
    return this.contacts.find((c) => c.id === id);
  }

  getMaxId(): number {
    // console.log('Getting the contacts maxId.');
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = Number(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Add contact will be called by the ContactEditComponent Save button
  addContact(newContact: Contact) {
    // console.log('Adding a contact.');
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    const contactsCloneList = this.contacts.slice();
    this.contactListChangedEvent.next(contactsCloneList);
  }

  // Update contact will be called by the ContactEditComponent Save button
  updateContact(originalContact: Contact, newContact: Contact) {
    // console.log('Updating a contact.');
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    const contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  // Delete contact will be called by the ContactDetailComponent Delete button
  deleteContact(contact: Contact) {
    console.log('Deleting a contact.');
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    const contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }
}
