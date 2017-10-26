import { Observable } from 'rxjs/Rx';
import { ElementRef } from '@angular/core';

export interface BaseGoogleMapsProvider {
    create(mapElement: ElementRef): Observable<any>;
    // initMap(mapElement: ElementRef);
    centerToGeolocation(): Observable<any>;
    centerToPosition(latLng): Observable<any>;
    getGeolocationPosition(): Observable<any>;
    addMarkerToGeolocation(title: string, infoClickCallback, animated?: boolean): Observable<any>;
    addMarker(
        position,
        title: string,
        infoClickCallback,
        animated: boolean
    ): Observable<any>;
}