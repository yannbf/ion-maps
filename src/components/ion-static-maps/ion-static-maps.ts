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
      + '&maptype=' + mapType;

    return url;
  }
}
