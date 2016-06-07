import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {HomePage} from '../home/home';
import {Fire} from '../../firebase/fire'

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [Fire]];
  }

  constructor(nav, fire, platform) {
    this.nav = nav;
    this.fire = fire;
    let _this = this;

    this.fire.showLoginPage(result => {
      _this.showButton = result;
      if (!result) {
        _this.login();
      }
    });
  }

  login() {
    this.fire.login(() => {
      this.nav.setRoot(HomePage);
    }, (error) => {
      alert(error);
    });
  }
}
