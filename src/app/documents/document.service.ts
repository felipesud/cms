import { EventEmitter, Injectable } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string) {
    return this.documents.find((document) => document.id === id);
  }

  // getDocument(id: string): Document | null {
  //   const document = this.documents.find((d) => d.id === id);
  //   return document ? document : null;
  // }
}
