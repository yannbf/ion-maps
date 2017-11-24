import { Component, ContentChildren, ElementRef, Input, QueryList, ViewChild } from '@angular/core';

import { IonMarker } from './ion-marker';
import { NativeGoogleMapsProvider } from '../providers/native-google-maps';

@Component({
  selector: 'ion-maps',
  template: `
    <div #map [style.height]="height" [style.width]="width"></div>
    <ng-content></ng-content>`,
  styles: [
    `ion-maps {
      .geolocation {

        $box-shadow: 0px 0px 2px  rgba(0,0,0,0.6);
        $icon-size: 20px;
        $icon-radius: 100%;
        $color-icon-outer: #65a3ff;
        $color-icon-inner: rgba(101, 163, 255, 0.4);

        z-index:2;
        position:absolute;
        width:$icon-size;
        height:$icon-size;
        border: 2px solid white;
        border-radius:$icon-radius;
        background:$color-icon-outer;
        box-shadow: $box-shadow;
        -moz-box-shadow: $box-shadow;
        -webkit-box-shadow: $box-shadow;
        -o-box-shadow: $box-shadow;

        .geolocation-inner {
          top: -2px;
          left: -2px;
          z-index:1;
          position: relative;
          width:$icon-size;
          height:$icon-size;
          background:$color-icon-inner;
          border: 1px solid rgba(101, 163, 255, 0.5);
          border-radius:$icon-radius;
          animation: 1.6s pulse infinite linear;
        }
      }

      @keyframes pulse {
        from  { transform: scale(1) }
        to {
          transform: scale(3);
          opacity:0;
        }
      }
    }`
  ]
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
   * Show your current position with a custom marker. Default value is false;
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
  }

  constructor(public mapsCtrl: NativeGoogleMapsProvider) { }

  centerToGeolocation() {
    return this.mapsCtrl.centerToGeolocation();
  }
}
