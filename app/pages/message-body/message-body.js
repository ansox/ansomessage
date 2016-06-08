import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ImageUtil} from '../../util/image-util';

@Component({
  templateUrl: 'build/pages/message-body/message-body.html',
})
export class MessageBodyPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, params) {
    this.nav = nav;

    this.message = params.get("message");

    let imageUtil = new ImageUtil();

    this.image = imageUtil.getRandomImage();
  }
}
