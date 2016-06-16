import {Injectable} from '@angular/core';
import {Fire} from '../firebase/fire';

@Injectable()
export class Messages {
  static get parameters() {
    return [[Fire]];
  }
  constructor(fire) {
    this.fire = fire;
  }

  getMessage(user, read, successCallback) {
    let ref = firebase.database().ref('messages/' + user.id);
    let _this = this;


    ref.orderByChild("read").equalTo(read).on("child_added", (snapshot, prev) => {
      let messagePost = snapshot.val();
      messagePost.key = snapshot.key;

      _this.fire.getPhoto(messagePost.sender_id, (photoUrl) => {
        messagePost.photo = photoUrl;
        messagePost.map =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        messagePost.latitude + ", " + messagePost.longitude +
        "&zoom=15&size=400x400" +
        "&markers=color:red%7Clabel:S%7C" +
        messagePost.latitude + ", " + messagePost.longitude +
        "&maptype=roadmap&key=AIzaSyC6YTdWh3HCd3fq_wCgi13wm0_2W0VZvv8";

        successCallback(messagePost);
      });

    });
  }

  setMessageRead(user, message, successCallback) {
    let updates = {};
    updates['/messages/' + user.id + '/' + message.key + '/read'] = true;

    if (firebase.database().ref().update(updates)) {
      successCallback();
    }
  }

  sendMessage(user, message, friend, latitude, longitude, endereco, successCallback) {
    let messageDate = new Date();
    let ref = firebase.database().ref();

    ref.child("messages").child(friend.id).push().set(
      {
        sender_id: user.id,
        sender_name: user.nome,
        message: message,
        latitude: latitude,
        longitude: longitude,
        endereco: endereco,
        read: false,
        message_date: messageDate.format('dd/mm/yyyy')
      }
    ).then(() => {
      this._getUser(friend.id, (user) => {
        let notification = {
          contents: {
            en: "Seu amigo " + user.name + " deixou uma nova mensagem pra você."
          },
          include_player_ids: [user.pushId]
        };

        window.plugins.OneSignal.postNotification(notification, (response) => {
          successCallback();
        });
      })
    })
  }

  _getUser(id, successCallback) {
    let ref = firebase.database().ref('users/' + id);

    ref.once("value", (snapshot, prev) => {
      let user = snapshot.val();
      successCallback(user);
    })
  }
}
