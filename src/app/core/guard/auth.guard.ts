import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, public authenticationService: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {
        const loggedIn = this.isLoggedIn();
        if (!loggedIn) {
            this.router.navigate(['']);
            return false;
        } else {
            return true;
        }
    }
    public isLoggedIn(): boolean {
        const loggedUser = this.localStorage.getItem('loggedUser');
        if (loggedUser) {
            return true;
        } else {
            return false;
        }
    }

}

@Injectable()
export class NoAuthGuard implements CanActivate {
    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, public authenticationService: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {
        const loggedIn = this.isLoggedIn();
        if (loggedIn) {
            this.router.navigate(['']);
            return false;
        } else {
            return true;
        }
    }
    public isLoggedIn(): boolean {
        const loggedUser = this.localStorage.getItem('loggedUser');
        if (loggedUser) {
            return true;
        } else {
            return false;
        }
    }
}

