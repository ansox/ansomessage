import {Component} from '@angular/core';
import {ionicBootstrap, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import {Fire} from './firebase/fire';
import {LoginUser} from './util/login-user';
import {Messages} from './util/messages';
import {FacebookUtil} from './util/facebook-util';


@Component({
  templateUrl: 'build/app.html',
})
export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [Fire, LoginUser, Messages, FacebookUtil]);
