import { IonMarker } from '../ion-marker/ion-marker';
import { mapStyles } from '../../providers/maps/maps.styles';
import { mapSettings } from '../../providers/maps/javascript-google-maps/google-maps.settings';
import { Component, ContentChildren, ElementRef, Input, QueryList, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'ion-static-maps',
  template: `
    <img class="ion-maps" #map [src]="mapsUrl" alt="maps"/>
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
  /**
   * The latitude position of the map.
   */
  @Input() address: string;
  /**
   * The latitude position of the map.
   */
  @Input() lat: number;
  /**
   * The latitude position of the map.
   */
  @Input() lng: number;

  /**
   * The height of the map. Default value is 400px.
   */
  @Input() height: number = 400;

  /**
   * The width of the map. Default value is 400px.
   */
  @Input() width: number = 400;

  /**
   * The zoom of the map. Default value is 15.
   */
  @Input() zoom: number = 15;

  /**
   * The format of the map. Default value is jpg.
   */
  @Input() format: string | StaticIonMapFormat;

  /**
   * The language of the map.
   */
  @Input() language: string;

  /**
   * The type of the map.  Default value is ROADMAP.
   */
  @Input() mapType: string | google.maps.MapTypeId;

  /**
   * The style of the map.
   */
  @Input() style: string | google.maps.StyledMapType[];

  @ViewChild('map') mapEl: ElementRef;
  @ContentChildren(IonMarker) mapMarkers: QueryList<IonMarker>;

  private markers: Array<IonMarker>;
  private mapsUrl: string;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    // Set size to the element so it already fits the screen before loading
    this.renderer.setStyle(this.mapEl.nativeElement, 'height', `${this.height}px`);
    this.renderer.setStyle(this.mapEl.nativeElement, 'width', `${this.width}px`);
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
    } = this;

    let url = mapSettings.staticMapsUrl
      + 'key=' + mapSettings.apiKey
      + '&center=' + (latLng ? latLng : this.address)
      + '&zoom=' + zoom
      + '&size=' + `${width}x${height}`
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
        let iconOrLabel = m.iconUrl ? `icon:${m.iconUrl}` : `label:${m.label}`;
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
