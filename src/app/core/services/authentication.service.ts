import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { PLATFORM_ID, Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { map, tap, first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import {
  AuthService,
  FacebookLoginProvider
} from 'angular-6-social-login';
import 'rxjs/add/operator/toPromise';

const httpOptions = {
  headers: new HttpHeaders(
    {
      // 'Content-Type': 'application/json'
    })
};


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  appId: string = environment.fbAppId;
  appBaseUrl: string = environment.appBaseUrl;
  isAdmin = false;
  loggedIn = false;
  isSuperAdmin = false;
  isUser = false;
  private userDetailSource = new BehaviorSubject('false');
  currentUser = this.userDetailSource.asObservable();
  private isLoginSource = new BehaviorSubject(false);
  isLoggedIn = this.isLoginSource.asObservable();
  constructor(private socialAuthService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId, @Inject(LOCAL_STORAGE) private localStorage: any, private toastrService: ToastrService, private httpClient: HttpClient) {

  }

  login(loginForm): Observable<User[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}client_login`, loginForm, httpOptions)
      .pipe(tap(res => {
        if (res) {
          // login successful if there's a jwt token in the response
          if (res && res.data && res['access_token'] && String(res.FLAG) === 'true') {
            this.setCurrentUser(res.data[0], res['access_token']);
          }
        }
        return res.data[0];
      }));
  }



  public socialSignIn() {
    return new Promise((resolve, reject) => {
      const socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          this.loginAndSignUpWithFb(userData)
            .pipe(first())
            .subscribe(res => {
              resolve(res);
            });
        });
    });
  }

  loginAndSignUpWithFb(user): Observable<User[]> {
    const formDetails = this.prepareSave(user);
    return this.httpClient.post<any>(`${environment.appBaseUrl}fb_login`, formDetails, httpOptions)
      .pipe(tap(res => {
        if (res) {
          // login successful if there's a jwt token in the response
          if (res && res.data && res['access_token'] && String(res.FLAG) === 'true') {
            console.log(user, 'asasd');
            const userDetails = {
              'id': res.data[0].id,
              'client_first_name': user.name.split(' ')[0],
              'client_last_name': user.name.split(' ')[1],
              'email': user.email,
              'contact_no': res.data[0].contact_no,
              'profile_pic': user.image,
              'google_place_id': res.data[0].google_place_id,
              'google_place_name': res.data[0].google_place_name,
              'device_type': res.data[0].device_type,
              'fb_login': true,
              'is_login': res.is_login
            };
            if (res.is_login === '1') {
              this.setCurrentUser(userDetails, res['access_token']);
            } else {
              this.localStorage.setItem('token', res['access_token']);
            }
            return userDetails;
          }
        }
      }), map(res => Object.assign(res.data[0], { name: user.name, email: user.email }, { 'is_login': res.is_login })));
  }


  private prepareSave(response): any {
    const input = new FormData();
    input.append('email', response.email);
    input.append('first_name', response.name.split(' ')[0]);
    input.append('last_name', response.name.split(' ')[1]);
    input.append('address', response.address);
    input.append('fb_id', response.id);
    input.append('device_type', '4');
    return input;
  }

  forgotPasssword(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}forgot_password`, formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }

  setUserRole = (role) => {
    switch (role) {
      case 'super_admin':
        this.isSuperAdmin = true;
        break;
      case 'admin':
        this.isAdmin = true;
        break;
      case 'user':
        this.isUser = true;
        break;
      default:

    }
  }

  checkIfSessionExists() {
    return this.httpClient.get<any>('token', httpOptions)
      .pipe(tap((token) => {
        if (!token) {
          this.resetStatus();
          return false;
        } else {
          return true;
        }
      }));
  }

  setCurrentUser(user: User, token) {
    const userDetials = this.buildUserDetails(user);
    this.loggedIn = true;
    this.localStorage.setItem('loggedUser', JSON.stringify(userDetials));
    this.localStorage.setItem('token', token);
    this.isLoginSource.next(true);
    this.userDetailSource.next(JSON.stringify(userDetials));
  }

  private buildUserDetails(user: User) {

    return {
      'id': user.id,
      'client_first_name': user.client_first_name,
      'client_last_name': user.client_last_name,
      'contact_no': user.contact_no,
      'email': user.email,
      'profile_pic': user.profile_pic,
      'google_place_id': user.google_place_id,
      'google_place_name': user.google_place_name,
      'device_type': user.device_type,
      'fb_login': user.fb_login || false
    };
  }

  resetPassword(formValue): Observable<any[]> {
    return this.httpClient.post<any>('reset-password', formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }

  changePassword(formValue): Observable<any[]> {
    return this.httpClient.post<any>('change-password', formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }

  sendOTP(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}send_otp`, formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }

  verifyEmail(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}email_verification`, formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }

  verifyReferalCode(formValue): Observable<any[]> {
     return this.httpClient.post<any>(`${environment.appBaseUrl}check_valid_referral_code`, formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }


  verifyOTP(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}verify_mobile`, formValue, httpOptions)
      .pipe(tap(res => {
        return true;
      }));
  }

  signup(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}sign_up`, formValue, httpOptions)
      .pipe(tap(res => {
        // if (res) {
        //   // login successful if there's a jwt token in the response
        //   if (res && res.data && res['access_token'] && String(res.FLAG) === 'true') {
        //     this.setCurrentUser(res.data[0], res['access_token']);
        //   }
        // }
        return res.data[0];
      }));
  }

  updateProfile(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}edit_personal_detail`, formValue, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  logout(): Observable<any[]> {
    // remove user from local storage to log user out
    return this.httpClient.post<any>(`${environment.appBaseUrl}client_logout`, {}, httpOptions)
      .pipe(tap(() => {
        this.toastrService.success('Logout Successfully.');
        this.resetStatus();
      }));
  }


  retrieveUserDetails() {
    return JSON.parse(this.localStorage.getItem('loggedUser'));
  }

  retrieveUserDetailsId() {
    return JSON.parse(this.localStorage.getItem('loggedUser'))['id'];
  }
  getToken() {
    return this.localStorage.getItem('token');
  }

  setProfileData(data: any) {
    let loggedUserObj = this.localStorage.getItem('loggedUser');
    loggedUserObj = JSON.parse(loggedUserObj);
    Object.assign(loggedUserObj, data);
    this.localStorage.setItem('loggedUser', JSON.stringify(loggedUserObj)); // updating local storage
    this.userDetailSource.next(JSON.stringify(loggedUserObj));
  }

  resetStatus() {
    this.localStorage.removeItem('loggedUser');
    this.localStorage.removeItem('token');
    this.isAdmin = false;
    this.loggedIn = false;
    this.isLoginSource.next(false);
    this.isSuperAdmin = false;
    this.isUser = false;
  }

  getHtmlFromServer(formValue): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.appBaseUrl}get_contents`, formValue, httpOptions)
      .pipe(tap(() => {
        return true;
      }));
  }
}
