import { IonMaps } from '../components/ion-maps';
import { IonMarker } from '../components/ion-marker';
import { ElementRef } from '@angular/core';

export interface BaseGoogleMapsProvider {
  create(map: IonMaps, markers?: Array<IonMarker>): Promise<any>;
  centerToGeolocation(): Promise<any>;
  centerToPosition(latLng): Promise<any>;
  getGeolocationPosition(): Promise<any>;
  addMarker(marker: IonMarker): Promise<any>;
}
