import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MessageBodyPage} from '../message-body/message-body';
import {Messages} from '../../util/messages';
import {LoginUser} from '../../util/login-user';

@Component({
  templateUrl: 'build/pages/messages-read/messages-read.html',
})
export class MessagesReadPage {
  static get parameters() {
    return [[NavController], [Messages], [LoginUser]];
  }

  constructor(nav, messages, loginUser) {
    this.nav = nav;
    this.messageList = [];

    messages.getMessage(loginUser.user, true, (messagePost) => {
      this.messageList.push(messagePost);
    });
  }

  openMessage(item) {
    this.nav.push(MessageBodyPage, {message: item});
  }
}
