import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {Fire} from '../../firebase/fire';
import {MapaPage} from '../mapa/mapa';

@Component({
  templateUrl: 'build/pages/friends/friends.html',
})
export class FriendsPage {
  static get parameters() {
    return [[NavController], [Fire]];
  }

  constructor(nav, fire) {
    this.nav = nav;
    this.fire = fire;

    let loading = Loading.create({
      spinner: "circles",
      content: "Loading..."
    });

    this.nav.present(loading);

    fire.getFriends((list) => {
      this.friendsList = list;

      for (var i = 0; i < this.friendsList.length; i++) {
        let friend = this.friendsList[i];
        fire.getPhoto(this.friendsList[i].id, (photoUrl) => {
          friend.photo = photoUrl;
        });
      }

      loading.dismiss();
    });
  }

  sendMessage(friend) {
    this.nav.push(MapaPage, {parametro: friend});
  }
}
