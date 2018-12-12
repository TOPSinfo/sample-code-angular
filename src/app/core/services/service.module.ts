import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { DataService } from './data.service';
import { BookingService } from './booking.service';
import { GoogleMapService } from './google-map.service';
import { CommonService } from './common.service'

const SERVICES = [
  UserService,
  AuthenticationService,
  DataService,
  BookingService,
  GoogleMapService,
  CommonService
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class ServiceModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ServiceModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
