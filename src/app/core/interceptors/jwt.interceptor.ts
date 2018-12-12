import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Optional() @Inject('serverUrl') protected serverUrl: string, @Inject(LOCAL_STORAGE) private localStorage: any, ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const token = this.localStorage.getItem('token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });
        } else {
            // console.log(this.serverUrl,'this.serverUrl', request.url);
            request = this.serverUrl && request.url.includes('/assets/i18n/en.json') ? request.clone({ url: `${this.serverUrl}/assets/i18n/en.json`, withCredentials: true }) : request.clone({ withCredentials: true });
            //request = request.clone({ withCredentials: true });
        }
        return next.handle(request);
    }
}
