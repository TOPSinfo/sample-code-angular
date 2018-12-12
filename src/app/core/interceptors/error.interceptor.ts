import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../core/services/common.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private toastrService: ToastrService, private authenticationService: AuthenticationService,private commonService: CommonService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(res => {
            // if (res['status'] === 200 && res['body'] && res['body']['FLAG'] === false && !res['body'].hasOwnProperty('token_status')) {
            //     const error = res['body']['MESSAGE'];
            //     throw _throw(error);
            // }
        }), catchError(err => {
            if (err.status === 401 && err.error.MESSAGE && (err.error.token_status = false || err.error.MESSAGE.includes('Session has expired') ||  err.error.MESSAGE.includes('Please login in again')) || err.error.MESSAGE.includes('Provide access token')) {
                const error = err.error.MESSAGE || err.statusText;
                this.toastrService.error(error);
                this.authenticationService.resetStatus();
                this.router.navigate(['/']);
                // if (this.commonService.getRedirectUrl()) {
                //     this.router.navigateByUrl(this.commonService.getRedirectUrl());
                //     this.commonService.clearRedirectUrl();
                //   } else {
                //     this.router.navigate(['/login']);
                //   }
            } else if (err.status === 400 || err.status === 500 || err.status === 401) {
                const error = err.error.MESSAGE || err.statusText;
                this.toastrService.error(error);
            }
            const errors = err.error.MESSAGE || err;
            return throwError(errors);
        }));
    }
}