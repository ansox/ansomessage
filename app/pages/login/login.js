import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {HomePage} from '../home/home';
import {LoginUser} from '../../util/login-user';

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [LoginUser]];
  }

  constructor(nav, login) {
    this.nav = nav;
    this.loginUser = login;
    let _this = this;

    this.loginUser.showLoginPage(result => {
      _this.showButton = result;
      if (!result) {
        _this.login();
      }
    });
  }

  login() {
    this.loginUser.login(() => {
      this.nav.setRoot(HomePage);
    }, (error) => {
      alert(error);
    });
  }
}
