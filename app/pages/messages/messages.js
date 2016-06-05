import {Page, NavController} from 'ionic-angular';
import {MessagesNewPage} from '../messages-new/messages-new';
import {MessagesReadPage} from '../messages-read/messages-read';

@Page({
  templateUrl: 'build/pages/messages/messages.html',
})
export class MessagesPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
    this.messagesNew = MessagesNewPage;
    this.messagesRead = MessagesReadPage;
  }
}
