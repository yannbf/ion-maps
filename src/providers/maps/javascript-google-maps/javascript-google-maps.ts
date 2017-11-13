import { IonMarker } from '../../../components/ion-marker/ion-marker';
import { IonMaps } from '../../../components/ion-maps/ion-maps';
import { GoogleMapsLoader } from './google-maps.loader';
import { BaseGoogleMapsProvider } from '../base-maps.interface';
import { ElementRef, Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonMapStyles } from '../../../components/maps.styles';
import { } from '@types/googlemaps';

@Injectable()
export class JavascriptGoogleMapsProvider implements BaseGoogleMapsProvider {
  map: google.maps.Map;
  markers = new Array<google.maps.Marker>();

  htmlMarker = class extends google.maps.OverlayView {
    
    latlng_;
    map_;
    options;
    parentclass;
    html;
    div_;
    pointer;
  
    constructor(latlng, map, parentclass, html, isPointer) {
      super();
      this.latlng_ = latlng;
      this.map_ = map;
      this.options = new Array();
      this.options.push(this.latlng_);
      this.options.push(this.map_);
      this.parentclass = parentclass;
      this.html = html;
      this.pointer = isPointer;
  
      this.div_ = null;
      this.setValues(this.options);
    }
  
    draw() {
      let self = this;
  
      //Create the parent element marker
      this.div_ = document.createElement('div');
      //set any classes defined for the parent element
      this.div_.className = this.parentclass;
      //parent element must be set to absolute so it's positioned correctly on the map
      this.div_.style.position = 'absolute';
      this.div_.style.width = '200px';
      this.div_.style.height = '200px';
      this.div_.style.background = 'black';
      //if the user wants the cursor to become a pointer when hovered
      if (this.pointer) {
        this.div_.style.cursor = 'pointer';
      }
      //add the user defined HTML string to the parent div marker...
      this.div_.innerHTML = this.html;
  
      //not sure what this does...
      let panes = this.getPanes();
      //here the parent div gets added to the overlay image
      panes.overlayImage.appendChild(this.div_);
      //here we make sure that the marker becomes clickable in case the user wants to do something on click
      google.maps.event.addDomListener(this.div_, "click", function(event) {
        google.maps.event.trigger(self, "click", event);
      });
  
      //here we create the actual position of the marker on the map, this is where the marker gets added
      let point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (point) {
        this.div_.style.left = point.x + 'px';
        this.div_.style.top = point.y + 'px';
      }
    }
  
  }

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
      styles: this.parseMapStyles(map),
      // mapTypeId: mapType,
      // disableDefaultUI,
      // styles
    };

    this.map = new google.maps.Map(map.element.nativeElement, mapOptions);
    return Promise.resolve(this.map);
  }

  parseMapStyles(map: IonMaps) {
    return typeof map.mapStyle === 'string' 
           ? IonMapStyles[map.mapStyle]
           : map.mapStyle;
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

  addHtmlMarker(latlng, parentclass, html, isPointer) {
    //I know the syntax is weird...
    new this.htmlMarker(latlng, this.map, parentclass, html, isPointer);
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
