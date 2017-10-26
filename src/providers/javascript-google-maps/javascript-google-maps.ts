import { environment } from '../../environments/environments';
import { toPromise } from 'rxjs/operator/toPromise';
import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {} from '@types/googlemaps';

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider{
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
      script.src = `${this.mapsUrl}js
                    ?v=${environment.maps.version}
                    &key=${this.apiKey}
                    &callback=mapInit`;

      document.body.appendChild(script);
    }
  }

  // Note: Call this method on ngAfterViewInit
  create(mapElement: ElementRef): Promise<any> {
    window['mapInit'] = _ => this.initMap(mapElement);
    this.createMapsScriptTag();
    return this.ready.subscribe(data => Promise.resolve(data));
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
    this.ready.complete();
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
      const latLng: google.maps.LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      return latLng;
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

interface BaseGoogleMapsProvider{
  addMarkerToGeolocation
  create(mapElement: ElementRef): Promise<any>;
  initMap(mapElement: ElementRef);
  centerToGeolocation(): Promise<any>;
  centerToPosition(latLng): Promise<any>;
  getGeolocationPosition(): Promise<any>;
}
