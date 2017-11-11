import { IonMarker } from '../../../components/ion-marker/ion-marker';
import { IonMaps } from '../../../components/ion-maps/ion-maps';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
import { mapStyles } from '../maps.styles';
import { Injectable } from '@angular/core';
import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    LatLng,
    MarkerOptions,
} from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class NativeGoogleMapsProvider implements BaseGoogleMapsProvider{
  map: GoogleMap;

  constructor(
    public geolocation: Geolocation,
    private googleMaps: GoogleMaps) {
  }

  // Note: Call this method on ngAfterViewInit
  create(map: IonMaps, markers = [], mapConfig: any = {}) {

    let options: GoogleMapOptions = {
      camera: {
        target: {
          lat: map.lat || 43.0741904,
          lng: map.lng || -89.3809802
        },
        zoom: map.zoom || 16,
        tilt: map.zoom || 30
      },
      controls: {
        compass: false,
        myLocationButton: true,
        zoom: true
      },
      styles: mapConfig.styles || mapStyles.standard
    };

    this.map = this.googleMaps.create(map.element.nativeElement, options);
    return this.map.one(GoogleMapsEvent.MAP_READY)
                   .then(_ => this.loadMarkers(markers));
  }

  loadMarkers(markers) {
    markers.map(marker => this.addMarker(marker));
  }

  centerToGeolocation() {
    return this.getGeolocationPosition()
      .then((position) => this.centerToPosition(position));
  }

  getGeolocationPosition() {
    return this.geolocation.getCurrentPosition()
      .then((position) => new LatLng(position.coords.latitude, position.coords.longitude));
  }

  centerToPosition(latLng: any, zoom?: number, tilt?: number) {
    const cameraPosition = {
      target: latLng,
      zoom  : zoom || 15,
      tilt  : tilt || 10
    };
    return this.map.moveCamera(cameraPosition);
  }

  addMarker(marker: IonMarker) {
    const { lat, lng, iconUrl, title,
      animated, draggable, visible,
      zIndex } = marker;
    const markerOptions: MarkerOptions = {
      position: new LatLng(lat, lng),
      title,
      icon: iconUrl,
      animation: animated ? GoogleMapsAnimation.DROP : null,
      zIndex,
      draggable,
      visible
    };

    return this.map.addMarker(markerOptions);
  }
}
