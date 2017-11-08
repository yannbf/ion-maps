import { ElementRef } from '@angular/core';

export interface BaseGoogleMapsProvider {
  create(mapElement: ElementRef): Promise<any>;
  centerToGeolocation(): Promise<any>;
  centerToPosition(latLng): Promise<any>;
  getGeolocationPosition(): Promise<any>;
  addMarkerToGeolocation(
    title: string,
    infoClickCallback,
    animated?: boolean ): Promise<any>;
  addMarker(
    position,
    title: string,
    infoClickCallback,
    animated: boolean ): Promise<any>;
}
