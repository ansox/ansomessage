import {Component} from '@angular/core';
import {NavController, Platform, NavParams, Loading, Toast} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Messages} from '../../util/messages';
import {LoginUser} from '../../util/login-user';

@Component({
  templateUrl: 'build/pages/mapa/mapa.html',
})
export class MapaPage {
  static get parameters() {
    return [[NavController], [Platform], [Messages], [NavParams], [LoginUser]];
  }

  constructor(nav, platform, messages, params, loginUser) {
    this.nav = nav;
    this.map = {};
    this.messages = messages;
    this.user = loginUser.user;
    this.message = "";
    this.endereco = "";

    this.friend = params.get("parametro");

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loadMap();
    });

  }


  loadMap() {
    let loading = Loading.create({
      spinner: "circles",
      content: "Loading..."
    });

    this.nav.present(loading);

    Geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(this.latitude, this.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      let mapa = document.getElementById('map');

      this.map = new google.maps.Map(mapa, mapOptions);

      let marker = new google.maps.Marker({
        position: latLng,
        tile: "Hello"
      });

      marker.setMap(this.map);

      loading.dismiss();

      var geocoder = new google.maps.Geocoder;

      let obj = this;

      geocoder.geocode({'location':latLng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            obj._setEndereco(results[0].formatted_address);
          }
        }
      });
    });
  }

  _setEndereco(endereco) {
    this.endereco = endereco;
  }

  sendMessage() {
    this.messages.sendMessage(this.user, this.message, this.friend, this.latitude, this.longitude, this.endereco, () => {
      let toast = Toast.create({
        message: 'Mensagem enviada com sucesso!',
        duration: 2000,
        position: 'bottom'
      });

      this.nav.present(toast);

      this.nav.pop();
    });

  }
}
