import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig } from './config/app.config';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './core/core.module';
import { JwtInterceptor, ErrorInterceptor } from './core/interceptors';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'sample-code',
  });
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ThemeModule.forRoot(),
    ReactiveFormsModule,
    CoreModule.forRoot(),
    ToastrModule.forRoot(),
    // NgProgressModule,
    NgxUiLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    }),
    NgxUiLoaderHttpModule.forRoot({ showForeground: false }),
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})


export class AppModule { }
