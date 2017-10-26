import { Observable } from 'rxjs/Rx';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
import { environment } from '../../environments/environments';
import { toPromise } from 'rxjs/operator/toPromise';
import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {} from '@types/googlemaps';
import { fromPromise } from "rxjs/observable/fromPromise";

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider {
  map: google.maps.Map;
  mapsUrl: string = environment.maps.url;
  apiKey: string = environment.maps.apiKey;
  markers = new Array<google.maps.Marker>();
  ready = new EventEmitter();

  constructor(
    public geolocation: Geolocation
  ) { }

  createMapsScriptTag() {
    // Make sure there's only one tag in the application
    if (!document.body.children['googleMaps']) {
      const script = document.createElement('script');
      script.id = 'googleMaps';
      script.src = `${this.mapsUrl}js?v=${environment.maps.version}&key=${this.apiKey}&callback=mapInit`;

      document.body.appendChild(script);
    }
  }

  // Note: Call this method on ngAfterViewInit
  create(mapElement: ElementRef): Observable<any> {
    window['mapInit'] = _ => this.initMap(mapElement);
    this.createMapsScriptTag();
    return this.ready.asObservable();
  }

  initMap(mapElement: ElementRef) {
    const mapOptions: google.maps.MapOptions  = {
      zoom: 18,
      tilt: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    this.ready.next(this.map);
    // this.ready.complete();
  }

  centerToGeolocation(): Observable<any>  {
    return this.getGeolocationPosition()
      .map(
        position => this.centerToPosition(position),
        error => Promise.reject(error)
      );
  }

  getGeolocationPosition(): Observable<any> {
    const geolocationPromise = this.geolocation.getCurrentPosition()
      .then(position => new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    return fromPromise(geolocationPromise);
  }

  centerToPosition(latLng: google.maps.LatLng): Observable<any> {
    return Observable.of(this.map.panTo(latLng));
  }

  addMarker(position :google.maps.LatLng,
            title: string,
            infoClickCallback,
            animated = true): Observable<google.maps.Marker> {
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

    return Observable.of(marker);
  }

  addMarkerToGeolocation(title: string, infoClickCallback, animated?: boolean): Observable<any> {
    return this.getGeolocationPosition()
      .map(position => {
        return this.addMarker(position, title, infoClickCallback, animated);
      });
  }
}
