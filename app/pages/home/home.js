import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {MessagesPage} from '../messages/messages';
import {FriendsPage} from '../friends/friends';
import {Fire} from '../../firebase/fire';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  static get parameters() {
    return [[Platform], [Fire]];
  }
  constructor(platform, fire) {
    this.messages = MessagesPage;
    this.friends = FriendsPage;
    this.rootPage = MessagesPage;

    platform.ready().then(() => {
      var notificationOpenedCallback = function(jsonData) {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      };

      window.plugins.OneSignal.init("020c0b61-0f92-452d-a3fb-c2421e9ea089",
                                     {googleProjectNumber: "183826080960"},
                                     notificationOpenedCallback);

      // Show an alert box if a notification comes in when the user is in your app.
      window.plugins.OneSignal.enableInAppAlertNotification(false);

      window.plugins.OneSignal.enableNotificationsWhenActive(true);

      fire.setPushId(() => {
        console.log('add push id');
      });

    });
  }

  openMenu(opcao) {
    this.rootPage = opcao;
  }

}
