import {Injectable} from '@angular/core';
import {Facebook, SocialSharing} from 'ionic-native';
import {Fire} from '../firebase/fire';

@Injectable()
export class FacebookUtil {
  static get parameters() {
    return [[Fire]];
  }
  constructor(fire) {
    this.fire = fire;
  }

  _getPhotos(list, successCallback) {
    for (var i = 0; i < list.length; i++) {
      let friend = list[i];
      this.fire.getPhoto(list[i].id, (photoUrl) => {
        friend.photo = photoUrl;
      });
    }

    successCallback(list);
  }

  getFriends(user, successCallback) {
    Facebook.api("/me/friends?access_token=" + user.token, []).then(response => {
      let list = response.data;
      this._getPhotos(list, successCallback);
    })
  }

  inviteFriend() {
    SocialSharing.shareViaFacebook('Teste', '', 'http://ansodev.com');
  }


}
