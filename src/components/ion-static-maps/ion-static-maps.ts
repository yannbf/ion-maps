import { mapStyles } from '../../providers/maps/maps.styles';
import { mapSettings } from '../../providers/maps/javascript-google-maps/google-maps.settings';
import { Component } from '@angular/core';

@Component({
  selector: 'ion-static-maps',
  template: `<img class="ion-maps" [src]="mapsUrl"/>`
})
export class IonStaticMapsComponent {

  mapsUrl: string;

  constructor() {
    this.mapsUrl = this.generateMapsUrl();
  }

  generateMapsUrl() {
    let address = 'New York';
    let latLng = '40.714728,-73.998672';
    let mapType = 'roadmap';
    let zoom = 16;
    const url = mapSettings.staticMapsUrl
      + 'key=' + mapSettings.apiKey
      + '&center=' + (latLng ? latLng : address)
      + '&zoom=' + zoom
      + '&size=600x300'
      + '&maptype=' + mapType
      + this.convertMapStyles(mapStyles.military)

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

    return encodeURI(styleStr);
  }
}
