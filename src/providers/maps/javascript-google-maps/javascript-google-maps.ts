import { GoogleMapsLoader } from './google-maps.loader';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
import { ElementRef, Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider{
  map: google.maps.Map;
  markers = new Array<google.maps.Marker>();

  constructor(
    public geolocation: Geolocation
  ) { }

  // Note: Call this method on ngAfterViewInit
  create(mapElement: ElementRef): Promise<any> {
    return GoogleMapsLoader.load().then(_ => this.initMap(mapElement));
  }

  initMap(mapElement: ElementRef) {
    const mapOptions: google.maps.MapOptions  = {
      zoom: 18,
      tilt: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    return this.map;
  }

  centerToGeolocation(): Promise<any> {
    const centerGeolocationPromise = this.getGeolocationPosition()
    .then(
      position => this.centerToPosition(position),
      error => Promise.reject(error)
    );

    return centerGeolocationPromise;
  }

  getGeolocationPosition(): Promise<google.maps.LatLng> {
    const geolocationPromise = this.geolocation.getCurrentPosition().then((position) => {
      return new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    }, error => Promise.reject(error));

    return geolocationPromise;
  }

  centerToPosition(latLng: google.maps.LatLng): Promise<any> {
    return Promise.resolve(this.map.panTo(latLng));
  }

  addMarker(position :google.maps.LatLng,
            title: string,
            infoClickCallback,
            animated = true): Promise<google.maps.Marker> {
    const marker = new google.maps.Marker({
      title,
      position,
      map: this.map,
      animation: animated ? google.maps.Animation.DROP : null,
    });

    const infoWindow = new google.maps.InfoWindow({ content: title });

    marker.addListener('click', _ => infoWindow.open(this.map, marker));
    infoWindow.addListener('click', _ => infoClickCallback);

    this.markers.push(marker);

    return Promise.resolve(marker);
  }

  addMarkerToGeolocation(title: string, infoClickCallback, animated?: boolean): Promise<google.maps.Marker> {
    const geolocationPromise = this.getGeolocationPosition()
      .then(position => {
        return this.addMarker(position, title, infoClickCallback, animated);
      });

    return geolocationPromise;
  }
}
