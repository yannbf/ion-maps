import { IonMaps } from '../../ion-maps/components/ion-maps/ion-maps';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(IonMaps) ionMaps: IonMaps;

  constructor(
    public navCtrl: NavController,
  ) { }

  addMarker() {
    this.ionMaps.centerToGeolocation();
  }
}
