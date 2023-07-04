import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  contact: Contact;
  maxContactId: number;

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://127.0.0.1:3000/contacts'
      )
      .pipe(
        map((responseData) => {
          const contacts: Contact[] = responseData.contacts;
          return contacts;
        })
      )
      .subscribe((responseData) => {
        this.contacts = responseData;
        this.sortAndSend();
      }),
      (error: any) => {
        console.log('Error: ', error);
      };
    return this.contacts;
  }

  getContactId(id: string) {
    return this.http.get<{ message: string; contact: Contact }>(
      `http://127.0.0.1:3000/contacts/${id}`
    );
  }

  getContact(id: string) {
    return this.contacts.find((contact) => contact.id === id);
  }

  getMaxId(): number {
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
  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.sortAndSend();
        this.getContacts();
      });
  }

  // Update contact will be called by the ContactEditComponent Save button
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((d) => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    // newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
        this.getContacts();
      });
  }

  // Delete contact will be called by the ContactDetailComponent Delete button
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((d) => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
        this.getContacts();
      });
  }

  sortAndSend() {
    this.contacts.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
