import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonMaps } from './components/ion-maps';
import { IonStaticMapsComponent } from './components/ion-static-maps';
import { IonMarker } from './components/ion-marker';
import { IonMapsProvidersModule } from './providers/providers.module';

@NgModule({
  declarations: [
    IonMaps,
    IonStaticMapsComponent,
    IonMarker,
  ],
	imports: [
    IonMapsProvidersModule.forRoot(),
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