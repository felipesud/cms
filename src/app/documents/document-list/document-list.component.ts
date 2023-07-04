import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private subscription: Subscription;

  constructor(private documentsService: DocumentsService) {}

  ngOnInit() {
    this.subscription = this.documentsService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        if (Array.isArray(documents)) {
          this.documents = documents;
        } else {
          // Handle the error case appropriately
          console.error('Error retrieving documents:', documents);
        }
      }
    );
    this.documentsService.getDocuments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
