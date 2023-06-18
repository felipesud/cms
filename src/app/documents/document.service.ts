import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.documents = this.documents;
    this.getDocuments();
    // this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    // return this.documents.slice();
    return (
      this.http.get<Document[]>(
          'https://felipe-125b2-default-rtdb.firebaseio.com/documents.json'
        ).subscribe((documents: Document[]) => {
          this.documents = documents;
          // this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          this.documentListChangedEvent.next(this.documents.slice());
        }),
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  getDocument(id: string) {
    return this.documents.find((document) => document.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = Number(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId = this.getMaxId();

    this.maxDocumentId++;
    // console.log(this.maxDocumentId);
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
    this.documents.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  storeDocuments() {
    const documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/JsonPipe'
    );
    this.http
      .put(
        'https://felipe-125b2-default-rtdb.firebaseio.com/documents.json',
        documents,
        { headers }
      )
      .subscribe(() => {
        const cloneDocuments = this.documents.slice();
        this.documentListChangedEvent.next(cloneDocuments);
      });
  }
}
