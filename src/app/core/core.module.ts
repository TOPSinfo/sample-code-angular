import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './guard/auth.guard';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import {  SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angular-6-social-login';
import { environment } from '../../environments/environment';
import { ServiceModule } from './services/service.module';
import { DirectiveModule } from './directives/directive.module';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(environment.fbAppId)
      },
    ]
  );
  return config;
}
export const NB_CORE_PROVIDERS = [
  ...ServiceModule.forRoot().providers,
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    SocialLoginModule
  ],
  declarations: [SearchFilterPipe],
  exports: [SearchFilterPipe],
  providers: [
    AuthGuard,
    NoAuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        AuthGuard,
        NoAuthGuard,
        SearchFilterPipe
      ]
    };
  }
}
