import { Component, ContentChildren, ElementRef, Input, QueryList, ViewChild } from '@angular/core';

import { IonMarker } from '../ion-marker/ion-marker';
import { NativeGoogleMapsProvider } from '../../providers/maps/native-google-maps/native-google-maps';

@Component({
  selector: 'ion-maps',
  template: `
    <div #map [style.height]="height" [style.width]="width"></div>
    <ng-content></ng-content>
  `
})
export class IonMaps {
  /**
   * The latitude position of the map.
   */
  @Input() lat: number;

  /**
   * The longitude position of the map.
   */
  @Input() lng: number;

  /**
   * The height of the map. Default value is '100%'.
   */
  @Input() height: string = '100%';

  /**
   * The width of the map. Default value is '100%'.
   */
  @Input() width: string = '100%';

  /**
   * The zoom of the map. Default value is 16.
   */
  @Input() zoom: number = 15;

  /**
   * The tilt of the map.
   */
  @Input() tilt: number;

  /**
   * Show your current position with a custom marker.
   */
  @Input() showGeolocation: boolean;

  /**
   * The style of the map.
   */
  @Input() mapStyle: string | any[];

  @ViewChild('map') element: ElementRef;
  @ContentChildren(IonMarker) markers: QueryList<IonMarker>;

  ngAfterContentInit() {
    // After content is rendered, load markers, if any
    let markers = this.markers.toArray();

    // Then, generate the map itself
    this.mapsCtrl.create(this, markers);

    //I'm guessing this will fail when the generated map is a native one... Will need a fix for that

    //if showGeolocation is set to true
    if (this.showGeolocation) {
      //get the current geolocation
      let latlng = this.mapsCtrl.getGeolocationPosition();
    }
  }

  constructor(public mapsCtrl: NativeGoogleMapsProvider) { }

  centerToGeolocation() {
    return this.mapsCtrl.centerToGeolocation();
  }
}
