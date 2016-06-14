import {Injectable} from '@angular/core';

@Injectable()
export class Fire {

  constructor() {

    var config = {
      apiKey: "AIzaSyBAx9__z0plxVN_qSrkbDLgj9uXF2rIF8k",
      authDomain: "ansohunter.firebaseapp.com",
      databaseURL: "https://ansohunter.firebaseio.com",
      storageBucket: "ansohunter.appspot.com",
    };

    firebase.initializeApp(config);
  }

  getPhoto(id, successCallback) {
    let ref = firebase.database().ref('users/' + id);

    ref.once("value", (snapshot, prev) => {
      let user = snapshot.val();
      successCallback(user.photo);
    });
  }

  setPushId(successCallback) {
    window.plugins.OneSignal.getIds(ids => {
      let updates = {};
      updates['/users/' + this.user.id + '/pushId'] = ids.userId;

      if(firebase.database().ref().update(updates)) {
        successCallback();
      }
    });

  }
}
