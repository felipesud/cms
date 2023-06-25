import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css'],
})
export class DocumentItemComponent implements OnInit {
  @Input() document: Document;
  @Output() documentSelected = new Subject<void>();

  constructor() {}

  ngOnInit() {}

  onSelectedDocument() {
    this.documentSelected.next();
  }
}
