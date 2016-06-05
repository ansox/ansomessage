import {Page, NavController} from 'ionic-angular';
import {Fire} from '../../firebase/fire';
import {Geolocation} from 'ionic-native';
import {RotasPage} from '../rotas/rotas';
import {MessageBodyPage} from '../message-body/message-body'

@Page({
  templateUrl: 'build/pages/messages-new/messages-new.html',
})
export class MessagesNewPage {
  static get parameters() {
    return [[NavController], [Fire]];
  }

  constructor(nav, fire) {
    this.nav = nav;

    this.messageList = [];
    this.fire = fire;

    this.fire.getMessage(false, (messagePost) => {
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
    this.nav.push(MessageBodyPage, {message: item});
    this.fire.setMessageRead(item, () => {
      let index = _this.messageList.indexOf(item);
      if (index >= 0) {
        this.messageList.splice(index, 1);
      }
    });
  }
}
