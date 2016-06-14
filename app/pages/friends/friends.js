import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {FacebookUtil} from '../../util/facebook-util';
import {LoginUser} from '../../util/login-user';
import {MapaPage} from '../mapa/mapa';

@Component({
  templateUrl: 'build/pages/friends/friends.html',
})
export class FriendsPage {
  static get parameters() {
    return [[NavController], [FacebookUtil], [LoginUser]];
  }

  constructor(nav, facebookUtil, loginUser) {
    this.nav = nav;

    let loading = Loading.create({
      spinner: "circles",
      content: "Loading..."
    });

    this.nav.present(loading);

    facebookUtil.getFriends(loginUser.user, (list) => {
      this.friendsList = list;

      loading.dismiss();
    });
  }

  sendMessage(friend) {
    this.nav.push(MapaPage, {parametro: friend});
  }
}
