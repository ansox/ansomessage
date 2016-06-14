import {Component} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {MessagesPage} from '../messages/messages';
import {FriendsPage} from '../friends/friends';
import {LoginPage} from '../login/login';
import {LoginUser} from '../../util/login-user';
import {FacebookUtil} from '../../util/facebook-util';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  static get parameters() {
    return [[Platform], [NavController], [LoginUser], [FacebookUtil]];
  }
  constructor(platform, nav, loginUser, facebookUtil) {
    this.messages = MessagesPage;
    this.friends = FriendsPage;
    this.rootPage = MessagesPage;
    this.nav = nav;
    this.loginUser = loginUser;
    this.facebookUtil = facebookUtil;
  }

  openMenu(opcao) {
    this.rootPage = opcao;
  }

  invite() {
    this.facebookUtil.inviteFriend();
  }

  logout() {
    let _this = this;
    this.loginUser.logout(() => {
      _this.nav.setRoot(LoginPage);
    });
  }

}
