import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/message-body/message-body.html',
})
export class MessageBodyPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, params) {
    this.nav = nav;

    this.message = params.get("message");
  }
}
