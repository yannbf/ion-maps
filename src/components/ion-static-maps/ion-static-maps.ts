import { mapStyles } from '../../providers/maps/maps.styles';
import { mapSettings } from '../../providers/maps/javascript-google-maps/google-maps.settings';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ion-static-maps',
  template: `<img class="ion-maps" [src]="mapsUrl"/>`
})
export class IonStaticMapsComponent {

  @Input() address: string;
  @Input() lat: number;
  @Input() lng: number;
  @Input() options: StaticIonMapOptions;

  mapsUrl: string;

  ngAfterViewInit() {
    console.log(this.address, this.lat, this.lng)
    this.mapsUrl = this.generateMapsUrl();
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

    const url = mapSettings.staticMapsUrl
      + 'key=' + mapSettings.apiKey
      + '&center=' + (latLng ? latLng : this.address)
      + '&zoom=' + (zoom || 15)
      + '&size=' + (width || 700) + 'x' + (height|| 700)
      + ( mapType ? ('&maptype=' + mapType) : '' )
      + ( language ? ('&language=' + language) : '' )
      + ( format ? ('&format=' + format) : '' )
      + ( style ? (this.convertMapStyles(style)) : '' );

    return url;
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

    // encoding is needed to build a valid url: https://developers.google.com/maps/web-services/overview#BuildingURLs
    return encodeURI(styleStr);
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
