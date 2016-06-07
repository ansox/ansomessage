import {Component} from '@angular/core';
import {NavController, Platform, NavParams, Loading} from 'ionic-angular';
import {Geolocation} from 'ionic-native';

@Component({ 
  templateUrl: 'build/pages/rotas/rotas.html',
})
export class RotasPage {
  static get parameters() {
    return [[NavController], [Platform], [NavParams]];
  }

  constructor(nav, platform, params) {
    this.nav = nav;
    this.map = {};
    this.message = "";
    this.directionsService = new google.maps.DirectionsService();

    this.directions = params.get("directions");

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loadMap();
    });

  }

  loadMap() {
    let loading = Loading.create({
      spinner: "circles",
      content: "Loading...",
      showBackdrop: false
    });

    this.nav.present(loading);

    Geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.directionsDisplay = new google.maps.DirectionsRenderer();

      let mapOptions = {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      let mapa = document.getElementById('route-map');

      this.map = new google.maps.Map(mapa, mapOptions);

      this.directionsDisplay.setMap(this.map);

      this._calcRoute(loading);
    });
  }

  _calcRoute(loading) {
    let origem = new google.maps.LatLng(this.latitude, this.longitude);
    let destino = new google.maps.LatLng(this.directions.latitude, this.directions.longitude);

    var request = {
      origin: origem,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    }

    this.directionsService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(result);
        loading.dismiss();
      }
    });
  }
}
