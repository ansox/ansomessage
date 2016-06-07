import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Fire} from '../../firebase/fire';
import {MessageBodyPage} from '../message-body/message-body';

@Component({
  templateUrl: 'build/pages/messages-read/messages-read.html',
})
export class MessagesReadPage {
  static get parameters() {
    return [[NavController], [Fire]];
  }

  constructor(nav, fire) {
    this.nav = nav;
    this.messageList = [];
    this.fire = fire;

    this.fire.getMessage(true, (messagePost) => {
      this.messageList.push(messagePost);
    });
  }

  openMessage(item) {
    this.nav.push(MessageBodyPage, {message: item});
  }
}
