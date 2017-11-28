import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { NativeGoogleMapsProvider } from './native-google-maps';
import { JavascriptGoogleMapsProvider } from './javascript-google-maps';
/**
 * Checks if the supplied document url is a one used by
 * cordova to load the app.
 *
 * @param {string} docUrl the current document url.
 */
export function isCordova(docUrl: string) {
  // if running `ionic cordova run PLATFORM --device --livereload`
  // it loads from the local ip of the host.
  const DEFAULT_LIVERELOAD_URL = new RegExp(/^http:\/\/\d+\.\d+\.\d+\.\d+\:810[0-9]/);

  // cordova by default loads app from file
  const DEFAULT_WEBVIEW_URL = 'file:///';

  // using ionic wk-webview creates a local webserver on the device to serve the app.
  const WK_WEBVIEW_URL = 'http://localhost:8080/var/containers/Bundle/Application';

  return docUrl.match(DEFAULT_LIVERELOAD_URL)
    || docUrl.startsWith(DEFAULT_WEBVIEW_URL)
    || docUrl.startsWith(WK_WEBVIEW_URL);
}

// Injection Token to pass document.url to angular contexts
const DOCUMENT_URL = new InjectionToken('document-url');
// returns the document url -- necessary for AoT compilation
export function documentUrlFactory() {
  return document.URL;
}


// Need factories for every provider that
// changes based on app runtime context
export function gmapsProviderFactory(docUrl: string, geolocation: Geolocation, gmaps: GoogleMaps) {
  return isCordova(docUrl)
    ? new NativeGoogleMapsProvider(geolocation, gmaps)
    : new JavascriptGoogleMapsProvider(geolocation);
}

/**
 * Import this module into your root module.
 *
 * Use it's static `.forRoot()` when importing
 * angular would register the providers into DI
 */
@NgModule()
export class IonMapsProvidersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonMapsProvidersModule,
      providers: [
        {
          provide: DOCUMENT_URL,
          useFactory: documentUrlFactory,
        },
        {
          provide: NativeGoogleMapsProvider,
          useFactory: gmapsProviderFactory,
          deps: [DOCUMENT_URL, Geolocation, GoogleMaps],
        },
      ],
    };
  }
}
