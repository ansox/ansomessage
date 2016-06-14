import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {RotasPage} from '../rotas/rotas';
import {MessageBodyPage} from '../message-body/message-body';
import {Messages} from '../../util/messages';
import {LoginUser} from '../../util/login-user';

@Component({
  templateUrl: 'build/pages/messages-new/messages-new.html',
})
export class MessagesNewPage {
  static get parameters() {
    return [[NavController], [Messages], [LoginUser]];
  }

  constructor(nav, messages, loginUser) {
    this.nav = nav;

    this.messageList = [];
    this.messages = messages;
    this.user = loginUser.user;

    this.messages.getMessage(this.user, false, (messagePost) => {
      this.messageList.push(messagePost);
      this._getAllDistances();
    });

    setInterval(() => {
      this._getAllDistances();
    }, 30000)
  }

  _getAllDistances() {
    Geolocation.getCurrentPosition().then((resp) => {
      for (var i = 0; i < this.messageList.length; i++) {
        let messagePost = this.messageList[i];

        messagePost.distance = this._getDistance(resp.coords.latitude,
          resp.coords.longitude, messagePost.latitude, messagePost.longitude);
      }
    });
  }

  _getDistance(lat,lng, dest_lat, dest_lng) {
    let distance  = geolib.getDistance(
      {latitude: lat, longitude: lng},
      {latitude: dest_lat, longitude: dest_lng});

    return geolib.convertUnit('km', distance, 2);
  }

  openMap(messagePost) {
    let directions = {latitude: messagePost.latitude, longitude: messagePost.longitude};

    this.nav.push(RotasPage, {directions: directions});
  }

  isNear(item) {
    // return item.distance <= 0.2;
    return true;
  }

  openMessage(item) {
    let _this = this;
    this.nav.push(MessageBodyPage, {message: item}).then(() => {
      this.messages.setMessageRead(this.user, item, () => {
        let index = _this.messageList.indexOf(item);
        if (index >= 0) {
          this.messageList.splice(index, 1);
        }
      });
    });
  }
}
