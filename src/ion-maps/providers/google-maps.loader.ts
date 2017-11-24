import { Injectable } from '@angular/core';

import { mapSettings } from '../config/google-maps.settings';

@Injectable()
export class GoogleMapsLoader {
    private static promise: Promise<any>;

    public static load(): Promise<any> {
        // First time 'load' is called?
        if (!GoogleMapsLoader.promise) {
            // Make promise to load
            GoogleMapsLoader.promise = new Promise( resolve => {
                // Set callback for when google maps is loaded.
                window['__onGoogleMapsLoaded'] = (ev) => {
                    resolve('google maps api loaded');
                };

                const { url, version, apiKey } = mapSettings;
                const mapsNode = document.createElement('script');
                mapsNode.src = `${url}js?v=${version}&key=${apiKey}&callback=__onGoogleMapsLoaded`;
                mapsNode.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(mapsNode);
            });
        }

        // Always return promise. When 'load' is called many times, the promise is already resolved.
        return GoogleMapsLoader.promise;
    }
}
