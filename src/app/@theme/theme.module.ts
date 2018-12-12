import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TranslateModule } from '@ngx-translate/core';                                      // google map

import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

import {
  HeaderComponent,
  FooterComponent,
  HomeComponent,
  ResetPasswordComponent,
} from './components';
import {
  SampleLayoutComponent,
} from './layout';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { BookingHeaderComponent } from './components/booking-header/booking-header.component';


const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  NgbModule,
  PerfectScrollbarModule
];

const NB_MODULES = [
  SharedModule,
  SlickCarouselModule,
  GooglePlaceModule,
  TranslateModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  HomeComponent,
  Error404Component,
  ResetPasswordComponent,
  SampleLayoutComponent,
];



const PIPES = [];

// const NB_THEME_PROVIDERS = [
//   ...NbThemeModule.forRoot(
//     {
//       name: 'default',
//     },
//     [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME ],
//   ).providers,
//   ...NbSidebarModule.forRoot().providers,
//   ...NbMenuModule.forRoot().providers,
// ];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES, PrivacyComponent, BookingHeaderComponent],
  entryComponents: [],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [],
    };
  }
}
