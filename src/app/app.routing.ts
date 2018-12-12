
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy , Route} from '@angular/router';
import { Error404Component } from './@theme/pages/error404/error404.component';
import { AppConfig } from './config/app.config';
import { MetaGuard } from '@ngx-meta/core';
import { HomeComponent } from './@theme/components/home/home.component';
import { PrivacyComponent } from './@theme/pages/privacy/privacy.component';
import { ResetPasswordComponent } from './@theme/components/reset-password/reset-password.component';
import { NoAuthGuard, AuthGuard } from './core/guard/auth.guard';
import { of, Observable, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
      const loadRoute = (delay) => delay
          ? timer(150).pipe(flatMap(_ => load()))
          : load();
      return route.data && route.data.preload
          ? loadRoute(route.data.delay)
          : of(null);
    }
}
const routes: Routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          meta: {
            title: 'Mobile Massage Therapy',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'login',
        loadChildren: './@theme/pages/login/login.module#LoginModule',
        canActivate: [NoAuthGuard],
        data: {
          meta: {
            title: 'Log in',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'signup',
        loadChildren: './@theme/pages/signup/signup.module#SignupModule',
        canActivate: [NoAuthGuard],
        data: {
          meta: {
            title: 'Sign up',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'signup/:referal-code',
        loadChildren: './@theme/pages/signup/signup.module#SignupModule',
        canActivate: [NoAuthGuard],
        data: {
          meta: {
            title: 'Sign up',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
          meta: {
            title: 'Reset Password',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'my-account',
        loadChildren: './pages/profile-page/profile-page.module#ProfilePageModule',
        canActivate: [AuthGuard],
        data: {
          preload: true, delay: false,
          meta: {
            title: 'My Account',
            description: 'London Serenity'
          }
        }
      },
      {
        path: 'quick_links/:name',
        component: PrivacyComponent,
        data: {
          meta: {
            title: 'Quick links',
            description: 'London Serenity'
          }
        }
      }
    ]
  },
  { path: '**', redirectTo: '' },
  { path: AppConfig.routes.error404, component: Error404Component }
];

@NgModule({
  providers: [AppPreloadingStrategy],
    imports: [
      RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled', preloadingStrategy: AppPreloadingStrategy })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class AppRoutingModule { }
