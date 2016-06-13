import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Facebook, SocialSharing} from 'ionic-native';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class Fire {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {

    var config = {
      apiKey: "AIzaSyBAx9__z0plxVN_qSrkbDLgj9uXF2rIF8k",
      authDomain: "ansohunter.firebaseapp.com",
      databaseURL: "https://ansohunter.firebaseio.com",
      storageBucket: "ansohunter.appspot.com",
    };

    firebase.initializeApp(config);

    this.ref = firebase.database().ref();

    this.http = http;
    this.user = {};

  }

  _setUser(accessToken, authData) {
    this.user.nome = authData.displayName;
    this.user.imagem = authData.photoURL;
    this.user.id = authData.uid;
    this.user.token = accessToken;

    this.ref.child("users").child(this.user.id).set(
      {
        name: this.user.nome,
        photo: this.user.imagem
      }
    );
  }

  _signInFirebase(token, successCallback, errorCallback) {
    let credential = firebase.auth.FacebookAuthProvider.credential(token);

    firebase.auth().signInWithCredential(credential).then(response => {
      this._setUser(token, response.providerData[0]);
      successCallback();
    }).catch(error => {
      errorCallback(error.message);
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

  getFriends(successCallback) {
    // this.http.get("https://graph.facebook.com/v2.5/me/friends?access_token=" + this.user.token)
    //   .subscribe((response) => {
    //     let list = response.json().data;
    //     successCallback(list);
    //   });

    Facebook.api("/me/friends?access_token=" + this.user.token, []).then(response => {
      let list = response.data;
      successCallback(list);
    })
  }

  getMessage(read, successCallback) {
    let ref = firebase.database().ref('messages/' + this.user.id);
    let _this = this;


    ref.orderByChild("read").equalTo(read).on("child_added", (snapshot, prev) => {
      let messagePost = snapshot.val();
      messagePost.key = snapshot.key;

      _this.getPhoto(messagePost.sender_id, (photoUrl) => {
        messagePost.photo = photoUrl;
        messagePost.map =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        messagePost.latitude + ", " + messagePost.longitude +
        "&zoom=15&size=400x400" +
        "&markers=color:red%7Clabel:S%7C" +
        messagePost.latitude + ", " + messagePost.longitude +
        "&maptype=roadmap&key=AIzaSyC6YTdWh3HCd3fq_wCgi13wm0_2W0VZvv8";

        successCallback(messagePost);
      })

    })
  }

  getPhoto(id, successCallback) {
    let ref = firebase.database().ref('users/' + id);

    ref.once("value", (snapshot, prev) => {
      let user = snapshot.val();
      successCallback(user.photo);
    });
  }

  getUser(id, successCallback) {
    let ref = firebase.database().ref('users/' + id);

    ref.once("value", (snapshot, prev) => {
      let user = snapshot.val();
      successCallback(user);
    })
  }

  sendMessage(message, friend, latitude, longitude, endereco) {
    let messageDate = new Date();
    this.ref.child("messages").child(friend.id).push().set(
      {
        sender_id: this.user.id,
        sender_name: this.user.nome,
        message: message,
        latitude: latitude,
        longitude: longitude,
        endereco: endereco,
        read: false,
        message_date: messageDate.format('dd/mm/yyyy')
      }
    ).then(() => {
      this.getUser(friend.id, (user) => {
        let notification = {
          contents: {
            en: "Seu amigo " + user.name + " deixou uma nova mensagem pra você."
          },
          include_player_ids: [user.pushId]
        };

        window.plugins.OneSignal.postNotification(notification, (response) => {
          alert(response);
        });
      })
    })
  }

  setMessageRead(message, successCallback) {
    let updates = {};
    updates['/messages/' + this.user.id + '/' + message.key + '/read'] = true;

    if (firebase.database().ref().update(updates)) {
      successCallback();
    }
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

  inviteFriend() {
    SocialSharing.shareViaFacebook('Teste', '', 'http://ansodev.com');
  }

  logout(successCallback) {
    let local = new Storage(LocalStorage);
    local.remove('token').then(() => {
      successCallback();
    });
  }
}
