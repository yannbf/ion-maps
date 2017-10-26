import { Observable } from 'rxjs/Rx';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
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
  create(element: ElementRef): Observable<any> {
    debugger;

    const cameraPosition = {
      zoom  : 18,
      tilt  : 10
    };

    const options = {
      mapType: GoogleMapsMapTypeId.NORMAL,
      styles: [],
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
    return this.map.on(GoogleMapsEvent.MAP_READY);
  }

  centerToGeolocation(): Observable<any>{
    return this.getGeolocationPosition().map((position) => {
      return this.centerToPosition(position);
    }, error => {
      return Promise.reject(error);
    });
  }

  getGeolocationPosition(): Observable<any> {
    const geolocationPromise = this.geolocation.getCurrentPosition()
      .then(position => new LatLng(position.coords.latitude, position.coords.longitude));
    return fromPromise(geolocationPromise);
  }

  centerToPosition(latLng: any, zoom?: number, tilt?: number) {
    const cameraPosition = {
      target: latLng,
      zoom  : zoom || 15,
      tilt  : tilt || 10
    };
    return fromPromise(this.map.moveCamera(cameraPosition));
  }

  addMarker(position, title: string, infoClickCallback, animated = true): Observable<any> {
    const markerOptions: MarkerOptions = {
      position,
      title,
      animation: animated ? GoogleMapsAnimation.DROP : null,
      infoWindowAnchor: infoClickCallback
    };

    return fromPromise(this.map.addMarker(markerOptions));
  }

  addMarkerToGeolocation(title: string, infoClickCallback, animated?: boolean) {
    // this.getGeolocationPosition().then(position => {
    //   this.addMarker(position, title, infoClickCallback, animated);
    // });
  }
}
