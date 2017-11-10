import { IonMarkerComponent } from '../ion-marker/ion-marker';
import { mapStyles } from '../../providers/maps/maps.styles';
import { mapSettings } from '../../providers/maps/javascript-google-maps/google-maps.settings';
import { Component, ContentChildren, ElementRef, Input, QueryList, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'ion-static-maps',
  template: `
    <img class="ion-maps" #map [src]="mapsUrl"/>
    <ng-content></ng-content>
  `,
  styles: [`
    img {
      background: #eee;
      opacity: 0;
      transition: opacity .15s ease-in;
    }

    img.loaded {
        opacity: 1;
    }
  `]
})
export class IonStaticMapsComponent {

  @Input() address: string;
  @Input() lat: number;
  @Input() lng: number;
  @Input() options: StaticIonMapOptions;
  @ViewChild('map') mapEl: ElementRef;
  @ContentChildren(IonMarkerComponent) mapMarkers: QueryList<IonMarkerComponent>;

  markers: Array<IonMarkerComponent>;
  mapsUrl: string;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    // Set size to the element so it already fits the screen before loading
    let { width = 400, height = 400 } = this.options;
    this.renderer.setStyle(this.mapEl.nativeElement, 'height', `${height}px`);
    this.renderer.setStyle(this.mapEl.nativeElement, 'width', `${width}px`);
  }

  ngAfterContentInit() {
    // After content is rendered, load markers, if any
    this.markers = this.mapMarkers.toArray();
    // Then, generate the map itself
    this.mapsUrl = this.generateMapsUrl();
    this.mapEl.nativeElement.classList.add('loaded');
  }

  generateMapsUrl() {
    let latLng: string;
    if(this.lat && this.lng) {
      latLng = `${this.lat},${this.lng}`;
    }

    let {
      zoom,
      width,
      height,
      mapType,
      language,
      format,
      style
    } = this.options;

    let url = mapSettings.staticMapsUrl
      + 'key=' + mapSettings.apiKey
      + '&center=' + 'Brooklyn+Bridge,New+York,NY'// (latLng ? latLng : this.address)
      + '&zoom=' + (zoom || 13)
      + '&size=' + (width || 400) + 'x' + (height || 400)
      + ( mapType ? ('&maptype=' + mapType) : '' )
      + ( language ? ('&language=' + language) : '' )
      + ( format ? ('&format=' + format) : '' )
      + ( style ? (this.convertMapStyles(style)) : '' );

    url += this.buildMarkersUrl();

    // encoding is needed to build a valid url: https://developers.google.com/maps/web-services/overview#BuildingURLs
    return encodeURI(url);
  }

  buildMarkersUrl() {
    return this.mapMarkers
    .map(m => {
      let iconOrLabel = m.icon ? `icon:${m.icon}` : `label:${m.label}`;
      return `&markers=color:${m.color}|${iconOrLabel}|${m.lat},${m.lng}`;
    })
    .reduce((x,y) => x + y)
  }

  convertMapStyles(styles) {
    const extractStyleRules = styles =>
      styles.map(rule => {
        let ruleElements = '';
        for (let s in rule) {
          ruleElements += `${s}:${rule[s]}|`;
        }
        return ruleElements.substring(0, ruleElements.length);
      })
      .reduce((x, y) => x + y);

    let styleStr = styles
      .map((style) => {
        let url = '&style=';
        url += style.featureType ? 'feature:' + style.featureType + '|' : '';
        url += style.elementType ? 'element:' + style.elementType + '|' : '';
        url += extractStyleRules(style.stylers);
        return url.substring(0, url.length - 1);
      })
      .reduce((x, y) => x + y);

    // static maps url only takes hex color in the given format: 0xRRGGBB, so we have to convert
    styleStr = styleStr.replace(/#/g,'0x');

    return styleStr;
  }
}

export interface StaticIonMapOptions {
  zoom?: number,
  width?: number,
  height?: number,
  mapType?: StaticIonMapType,
  style?: Array<any>,
  format?: StaticIonMapFormat,
  language?: string,
}

export enum StaticIonMapType {
  roadmap = 'roadmap',
  satellite = 'satellite',
  hybrid = 'hybrid',
  terrain = 'terrain'
}

export enum StaticIonMapFormat {
  png = 'png',
  jpeg = 'jpeg',
  gif = 'gif'
}
