import { Component, OnInit, Input } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css'],
})
export class MessageItemComponent implements OnInit {
  // inputMessage can be message. but it needs to be in the following locations
  // -- message-item.component.html
  // -- message-list.component.html
  @Input() inputMessage: Message;

  constructor() {}

  ngOnInit() {}
}
