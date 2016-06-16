import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Platform} from 'ionic-angular';
import {Facebook} from 'ionic-native';
import {Fire} from '../firebase/fire';

@Injectable()
export class LoginUser {
  static get parameters() {
    return [[Fire], [Platform]]
  }
  constructor(fire, platform) {
    this.fire = fire;
    this.user = {};
    this.platform = platform;
  }

  _setUser(accessToken, pushId, authData) {
    this.user.nome = authData.displayName;
    this.user.imagem = authData.photoURL;
    this.user.id = authData.uid;
    this.user.token = accessToken;
    this.user.pushId = pushId;

    let ref = firebase.database().ref();

    ref.child("users").child(this.user.id).set(
      {
        name: this.user.nome,
        photo: this.user.imagem
      }
    );
  }

  _initOneSignal() {
    var notificationOpenedCallback = function(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal.init("020c0b61-0f92-452d-a3fb-c2421e9ea089",
                                   {googleProjectNumber: "183826080960"},
                                   notificationOpenedCallback);

    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(false);

    window.plugins.OneSignal.enableNotificationsWhenActive(true);
  }

  _getPushId(successCallback) {
    this.platform.ready().then(() => {
      this._initOneSignal();
      window.plugins.OneSignal.getIds(ids => {
        successCallback(ids.userId);
      });
    });
  }

  _signInFirebase(token, successCallback, errorCallback) {
    this._getPushId((pushId) => {
      let credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase.auth().signInWithCredential(credential).then(response => {
        this._setUser(token, pushId, response.providerData[0]);
        successCallback();
      }).catch(error => {
        errorCallback(error.message);
      });
    });
  }

  _loginFacebook(successCallback, errorCallback) {
    Facebook.login(['user_friends']).then((response) => {
      let local = new Storage(LocalStorage);
      local.set('token', response.authResponse.accessToken);
      successCallback(response.authResponse.accessToken);
    }, (error) => {
      errorCallback(error.errorMessage);
    });
  }

  showLoginPage(successCallback) {
    let _this = this;
    let local = new Storage(LocalStorage);
    local.get('token').then(result => {
      _this.token = result;
      successCallback(result === null)
    });
  }

  login(successCallback, errorCallback) {
    if (this.token) {
      this._signInFirebase(this.token, successCallback, errorCallback);
    }
    else {
      this._loginFacebook((token) => {
        this._signInFirebase(token, successCallback, errorCallback);
      }, errorCallback);
    }
  }

  logout(successCallback) {
    let local = new Storage(LocalStorage);
    local.remove('token').then(() => {
      successCallback();
    });
  }
}
