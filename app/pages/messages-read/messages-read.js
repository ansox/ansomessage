import {Page, NavController} from 'ionic-angular';
import {Fire} from '../../firebase/fire';
import {MessageBodyPage} from '../message-body/message-body';

/*
  Generated class for the MessageReadPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
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
