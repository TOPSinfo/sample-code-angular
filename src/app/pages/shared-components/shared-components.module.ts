import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreatmentsComponent } from './treatments/treatments.component';
import { locationSharedComponent } from './location/location.component';
import { ViewInfoComponent } from './treatments/view-info/view-info.component';
import { AddonInfoComponent } from './treatments/addon-info/addon-info.component';
import { DurationInfoComponent } from './treatments/duration-info/duration-info.component';
import { HeaderAddOnComponent } from './treatments/header-addOn/header-addOn.component';
import { HeaderLengthComponent } from './treatments/header-length/header-length.component';
import { TherapistComponent } from './therapist/therapist.component';
import { TranslateModule } from '@ngx-translate/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { NgPipesModule } from 'ngx-pipes';
import { TherapistViewInfoComponent } from './therapist/therapist-view-info/therapist-view-info.component';

const COMPONENTS = [
  TreatmentsComponent,
  ViewInfoComponent,
  AddonInfoComponent,
  DurationInfoComponent,
  TherapistComponent,
  TherapistViewInfoComponent,
  locationSharedComponent,
  HeaderAddOnComponent,
  HeaderLengthComponent
];

const BASE_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  GooglePlaceModule,
  AgmCoreModule.forRoot({
    apiKey: environment.googleApiKey
  }),
  NgbModule,
  CommonModule,
  SlickCarouselModule,
  SharedModule,
  NgPipesModule
];
@NgModule({
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  imports: [
    ...BASE_MODULES
  ],
  entryComponents: [...COMPONENTS]
})
export class SharedComponentsModule { }
