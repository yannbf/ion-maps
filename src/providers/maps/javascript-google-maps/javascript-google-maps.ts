import { IonMarker } from '../../../components/ion-marker/ion-marker';
import { IonMaps } from '../../../components/ion-maps/ion-maps';
import { mapStyles } from '../maps.styles';
import { GoogleMapsLoader } from './google-maps.loader';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
import { ElementRef, Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider {
  map: google.maps.Map;
  markers = new Array<google.maps.Marker>();

  constructor(
    public geolocation: Geolocation
  ) { }

  // Note: Call this method on ngAfterViewInit
  create(map: IonMaps, markers = []): Promise<any> {
    return GoogleMapsLoader
      .load()
      .then(_ => this.initMap(map))
      .then(_ => this.loadMarkers(markers));
  }

  initMap(map: IonMaps) {
    const {
      lat,
      lng,
      zoom,
    } = map;

    const mapOptions: google.maps.MapOptions  = {
      center: new google.maps.LatLng(lat, lng),
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: mapStyles.standard,
      // mapTypeId: mapType,
      // disableDefaultUI,
      // styles
    };

    this.map = new google.maps.Map(map.element.nativeElement, mapOptions);
    return Promise.resolve(this.map);
  }

  loadMarkers(markers) {
    markers.map(marker => this.addMarker(marker));
  }

  centerToGeolocation(): Promise<any> {
    return this.getGeolocationPosition()
      .then(position => this.centerToPosition(position));
  }

  getGeolocationPosition(): Promise<google.maps.LatLng> {
    return this.geolocation.getCurrentPosition()
      .then((position) => new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  }

  centerToPosition(latLng: google.maps.LatLng): Promise<any> {
    return Promise.resolve(this.map.panTo(latLng));
  }

  addMarker(marker: IonMarker): Promise<google.maps.Marker> {
    const { lat, lng, label, iconUrl, title,
            animated, draggable, opacity, visible,
            zIndex } = marker;
    const mapMarker = new google.maps.Marker({
      label,
      title,
      opacity,
      visible,
      zIndex,
      icon: iconUrl,
      draggable,
      position: new google.maps.LatLng(lat,lng),
      map: this.map,
      animation: animated ? google.maps.Animation.DROP : null,
    });

    if(title) {
      const infoWindow = new google.maps.InfoWindow({ content: title });
      mapMarker.addListener('click', _ => infoWindow.open(this.map, mapMarker));
      // infoWindow.addListener('click', _ => infoClickCallback);
    }

    this.markers.push(mapMarker);

    return Promise.resolve(mapMarker);
  }

}
