import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(
      '1',
      'CSE110 - Introduction to Programming',
      'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
      'https://www.byui.edu/catalog#/courses/rkrSeUvn7',
      null
    ),
    new Document(
      '2',
      'WDD230 - Web Frontend Development I',
      'This course focuses on the planning, design, and development of responsive websites using HTML, CSS, and JavaScript with attention to usability, accessibility, and best practices in responsive frontend development.',
      'https://www.byui.edu/catalog#/courses/Nyl9Tsl2iZ',
      null
    ),
    new Document(
      '3',
      'WDD330 - Web Frontend Development II',
      'WDD 330 will continue with the topics presented in WDD 230 Web Front-end Development I: Building websites with HTML, CSS, and Javascript. This course will have a stronger emphasis on Javascript development and mobile design as students create mobile web applications.',
      'https://www.byui.edu/catalog#/courses/EJes6ox3oW',
      null
    ),
    new Document(
      '4',
      'CSE341 - Web Services',
      'This course focuses on the backend development of dynamic, service-oriented web applications. Students will learn how to design and implement web services, how to interact with data storage, and how to use these tools to build functioning web application.',
      'https://www.byui.edu/catalog#/courses/V1lze3gns-',
      null
    ),
    new Document(
      '5',
      'CSE340 - Web Backend Development',
      'This programming course focuses on constructing dynamic web sites using server-side languages, making use of databases and design patterns.  The concepts introduced in Web Frontend Development courses are expected to be continued and implemented.  ',
      'https://www.byui.edu/catalog#/courses/NkbpTol3i-',
      null
    ),
    
  ];
  constructor() {}

  ngOnInit() {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
