import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { SignupComponent } from './signup/signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { environment } from '../../../../environments/environment';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    NgbModule,
    TranslateModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
    })
  ]
})
export class SignupModule { }
