import { mapStyles } from '../../providers/maps/maps.styles';
import { StaticIonMapFormat, StaticIonMapOptions, StaticIonMapType } from '../../components/ion-static-maps/ion-static-maps';
import { IonMaps } from '../../components/ion-maps/ion-maps';
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
