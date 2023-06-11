import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

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

  constructor(
    private contactService: ContactService,
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

      this.originalContact = this.contactService.getContact(this.id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;

      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group &&
          this.originalContact.group.length > 0) {
            this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
    // this.router.navigate(['/contacts']);
  }

  onSubmit(form: NgForm) {}
}
