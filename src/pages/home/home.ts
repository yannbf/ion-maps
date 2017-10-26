import { JavascriptGoogleMapsProvider } from '../../providers/javascript-google-maps/javascript-google-maps';
import { NativeGoogleMapsProvider } from '../../providers/native-google-maps/native-google-maps';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('map') mapElement: ElementRef;

  constructor(
    public navCtrl: NavController,
    public mapsCtrl2: NativeGoogleMapsProvider,
    public mapsCtrl: JavascriptGoogleMapsProvider) {
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.mapsCtrl.create(this.mapElement).then((data) => {
      this.mapsCtrl.centerToGeolocation();
    });
  }

  addMarker() {
    this.mapsCtrl.addMarkerToGeolocation('Click me!', this.callbackSample);
  }

  callbackSample() {
    alert('The callback was called :D');
  }
}
