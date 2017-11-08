import { NativeGoogleMapsProvider } from '../../providers/maps/native-google-maps/native-google-maps';
import { NavController } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ion-maps',
  template: `
    <div #map [style.height]="height" [style.width]="width"></div>
  `
})
export class IonMaps {

  @ViewChild('map') mapElement: ElementRef;

  height = '100%';
  width = '100%';

  constructor(
    public navCtrl: NavController,
    public mapsCtrl: NativeGoogleMapsProvider
  ) { }

  // Load map only after view is initialized
  private ngAfterViewInit() {
    this.mapsCtrl.create(this.mapElement).then((data) => {
      this.mapsCtrl.centerToGeolocation();
    });
  }

  addMarker() {
    this.mapsCtrl.addMarkerToGeolocation('Click me!', null);
  }

  centerToGeolocation() {
    return this.mapsCtrl.centerToGeolocation();
  }
}
