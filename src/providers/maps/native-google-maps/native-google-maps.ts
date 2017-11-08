import { mapStyles } from '../maps.styles';
import { ElementRef, Injectable } from '@angular/core';
import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    GoogleMapsMapTypeId,
    LatLng,
    MarkerOptions,
} from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class NativeGoogleMapsProvider {
  map: GoogleMap;

  constructor(
    public geolocation: Geolocation,
    private googleMaps: GoogleMaps) {
  }

  // Note: Call this method on ngAfterViewInit
  create(element: ElementRef, mapConfig: any = {}) {
    let options: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: mapConfig.zoom || 18,
        tilt: mapConfig.zoom || 30
      },
      controls: {
        compass: false,
        myLocationButton: true,
        zoom: true
      },
      styles: mapConfig.styles || mapStyles.standard
    };

    this.map = this.googleMaps.create(element.nativeElement, options);
    return this.map.one(GoogleMapsEvent.MAP_READY);
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

  addMarker(position, title: string, infoClickCallback, animated = true) {
    const markerOptions: MarkerOptions = {
      position,
      title,
      animation: animated ? GoogleMapsAnimation.DROP : null,
      infoWindowAnchor: infoClickCallback
    };

    return this.map.addMarker(markerOptions);
  }

  addMarkerToGeolocation(title: string, infoClickCallback, animated?: boolean) {
    return this.getGeolocationPosition()
      .then(position => this.addMarker(position, title, infoClickCallback, animated));
  }
}
