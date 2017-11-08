import { mapStyles } from '../maps.styles';
import { ElementRef, Injectable } from '@angular/core';
import {
    CameraPosition,
    GoogleMap,
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

    const cameraPosition = {
      zoom: mapConfig.zoom || 18,
      tilt: mapConfig.tilt || 10
    };

    const options = {
      mapType: mapConfig.mapType || GoogleMapsMapTypeId.NORMAL,
      styles: mapConfig.styles || mapStyles.standard,
      camera: cameraPosition,
      backgroundColor: 'white',
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPicker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      },
      preferences: null,
    };

    this.map = this.googleMaps.create(element.nativeElement, options);
    return this.map.one(GoogleMapsEvent.MAP_READY);
  }

  centerToGeolocation() {
    return this.getGeolocationPosition().then((position) => {
      return this.centerToPosition(position);
    }, error => {
      return Promise.reject(error);
    });
  }

  getGeolocationPosition() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((position) => {
        const latLng: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
        resolve(latLng);
      }, error => {
        reject(error);
      });
    });
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
    this.getGeolocationPosition().then(position => {
      this.addMarker(position, title, infoClickCallback, animated);
    });
  }
}
