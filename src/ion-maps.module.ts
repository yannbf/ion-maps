import { NgModule, ModuleWithProviders } from '@angular/core';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

import {
  IonMaps,
  IonStaticMapsComponent,
  IonMarker,
  NativeGoogleMapsProvider,
  JavascriptGoogleMapsProvider,
  } from './index';

// Need factories for every provider that
// changes based on app runtime context
export function gmapsProviderFactory(platform: Platform, geolocation: Geolocation, gmaps: GoogleMaps) {
  return this.platform.ready()
    .then(_ => {
        return GoogleMaps.installed()
          ? new NativeGoogleMapsProvider(geolocation, gmaps)
          : new JavascriptGoogleMapsProvider(geolocation);
    });
}

export const COMPONENTS = [
  IonMaps,
  IonStaticMapsComponent,
  IonMarker,
]
@NgModule({
  declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class IonMapsModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: IonMapsModule,
      providers: [
        {
          provide: NativeGoogleMapsProvider,
          useFactory: gmapsProviderFactory,
          deps: [Geolocation, GoogleMaps],
        },
      ],
    };
  }
}
