import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { IonMarker } from '../components/ion-marker';
import { IonMapStyles } from '../config/maps.styles';
import { IonMaps } from '../components/ion-maps';

import { GoogleMapsLoader } from './google-maps.loader';
import { BaseGoogleMapsProvider } from './base-maps.interface';
import {} from '@types/google-maps';

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider {
  map: google.maps.Map;
  markers = new Array<google.maps.Marker>();
  USGSOverlay;

  constructor(
    public geolocation: Geolocation
  ) { }

  // Note: Call this method on ngAfterViewInit
  create(map: IonMaps, markers = []): Promise<any> {
    return GoogleMapsLoader
      .load()
      .then(_ => this.initMap(map))
      .then(_ => this.setupCustomHTMLMarker())
      .then(_ => this.addGeolocationPin(map.showGeolocation))
      .then(_ => this.loadMarkers(markers));
  }

  initMap(map: IonMaps) {
    const {
      lat,
      lng,
      zoom,
    } = map;

    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: this.parseMapStyles(map),
      // mapTypeId: mapType,
      // disableDefaultUI,
      // styles
    };

    this.map = new google.maps.Map(map.element.nativeElement, mapOptions);

    return Promise.resolve(this.map);
  }

  setupCustomHTMLMarker() {
    this.USGSOverlay = class extends google.maps.OverlayView {

      constructor(
        private latlng,
        private map,
        private parentclass,
        private html,
        private isPointer,
        private div
      ) {
        super();
        this.setMap(map);
      }

      onAdd() {
        // Create the parent element marker
        this.div = document.createElement('div');

        // Set any classes defined for the parent element
        this.div.className = this.parentclass;

        // Parent element must be set to absolute so it's positioned correctly on the map
        this.div.style.position = 'absolute';

        // If the user wants the cursor to become a pointer when hovered
        if (this.isPointer) {
          this.div.style.cursor = 'pointer';
        }

        // Add the user defined HTML string to the parent div marker...
        this.div.innerHTML = this.html;

        // The parent div gets added to the overlay image
        let panes = this.getPanes();
        panes.overlayImage.appendChild(this.div);
      }

      draw() {

        // We make sure that the marker becomes clickable in case the user wants to do something on click
        google.maps.event.addDomListener(this.div, 'click', (event) => {
          google.maps.event.trigger(this, 'click', event);
        });

        // We create the actual position of the marker on the map, this is where the marker gets added
        const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
        if (point) {
          this.div.style.left = `${point.x}px`;
          this.div.style.top = `${point.y}px`;
        }
      }
    }
  }

  addGeolocationPin(showGeolocation) {
    if(showGeolocation == 'true') {
      return this.getGeolocationPosition().then(position => {
        const geolocationHTML = `<div class='geolocation-inner'></div>`;
        new this.USGSOverlay(position, this.map, 'geolocation', geolocationHTML, false);
      });
    }
  }

  parseMapStyles(map: IonMaps) {
    return typeof map.mapStyle === 'string'
      ? IonMapStyles[map.mapStyle.toLowerCase()]
      : map.mapStyle;
  }

  loadMarkers(markers: IonMarker[]) {
    markers.map(marker =>  marker.customHTML ? this.addHtmlMarker(marker) : this.addMarker(marker));
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

  addHtmlMarker(marker: IonMarker) {
    const { lat, lng, customHTML, parentClass } = marker;
    new this.USGSOverlay(new google.maps.LatLng(lat, lng), this.map, parentClass, customHTML, true);
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
      position: new google.maps.LatLng(lat, lng),
      map: this.map,
      animation: animated ? google.maps.Animation.DROP : null,
    });

    if (title) {
      const infoWindow = new google.maps.InfoWindow({ content: title });
      mapMarker.addListener('click', _ => infoWindow.open(this.map, mapMarker));
      // infoWindow.addListener('click', _ => infoClickCallback);
    }

    this.markers.push(mapMarker);

    return Promise.resolve(mapMarker);
  }

}
