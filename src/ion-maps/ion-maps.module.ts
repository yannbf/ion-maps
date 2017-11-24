import { IonMaps } from './components/ion-maps/ion-maps';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonStaticMapsComponent } from './components/ion-static-maps/ion-static-maps';
import { IonMarker } from './components/ion-marker/ion-marker';
import { MyProvidersModule } from './providers/providers.module';

@NgModule({
  declarations: [
    IonMaps,
    IonStaticMapsComponent,
    IonMarker,
  ],
	imports: [
    MyProvidersModule.forRoot(),
  ],
	exports: [
    IonMaps,
    IonStaticMapsComponent,
    IonMarker,
  ]
})
export class IonMapsModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: IonMapsModule
    };
  }
}