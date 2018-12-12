import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePageComponent } from './profile-page.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { TranslateModule } from '@ngx-translate/core';
import { EditAddressComponent } from './user-profile/edit-address/edit-address.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core'; // google map
import { environment } from '../../../environments/environment';
import { WalletComponent } from './wallet/wallet.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { ShareModule } from '@ngx-share/core';
import { ClipboardModule } from 'ngx-clipboard';
import { DirectiveModule } from '../../core/directives/directive.module';
import { CreditCardImageDirective } from '../../core/directives/cc-logo.directive';
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
import { ReviewComponent } from './review/review.component';
@NgModule({
  imports: [
    CommonModule,
    ProfilePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GooglePlaceModule,
    SharedModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
    }),
    ShareModule.forRoot(),
    ClipboardModule,
    PerfectScrollbarModule,
    NgbModule,
    InfiniteScrollModule,
    DirectiveModule
  ],
  declarations: [
    UserProfileComponent,
    ProfilePageComponent,
    AppointmentsComponent,
    EditAddressComponent,
    WalletComponent,
    ChangePasswordComponent,
    ReferFriendComponent,
    ReviewComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [
    ReviewComponent
  ]
})
export class ProfilePageModule {}
