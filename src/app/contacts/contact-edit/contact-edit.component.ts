import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  invalidContact = false;

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactsService.getContact(this.id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;

      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group && this.originalContact.group.length > 0) {
        this.groupContacts = JSON.parse(
          JSON.stringify(this.originalContact.group)
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      console.log('New Contact');
      return (this.invalidContact = true);
    }

    if (this.contact && newContact.id === this.contact.id) {
      console.log('Contact already exsists.');
      return (this.invalidContact = true);
    }

    for (let i = 0; i < this.groupContacts.length; i++) {
      console.log('Whatever!');
      // this.invalidContact = false;
      if (newContact.id === this.groupContacts[i].id) {
        return (this.invalidContact = true);
      }
    }
    console.log('Returned false');
    return (this.invalidContact = false);
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    this.groupContacts.splice(index, 1);
    this.invalidContact = false;
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactsService.updateContact(this.originalContact, newContact);
    } else {
      this.contactsService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }
}
