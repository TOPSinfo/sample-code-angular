import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private profile = {
    name: 'user',
    image: 'assets/images/user.jpg'
  }; // : any = 'assets/images/user.jpg'

  private subject = new Subject<any>();

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  private stateSource = new BehaviorSubject('Login');
  currentState = this.stateSource.asObservable();
  private viewPort = new BehaviorSubject(false);
  footerViewPort = this.viewPort.asObservable();
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any) {}

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeState(state: string) {
    this.stateSource.next(state);
  }

  changeViewPort(state: boolean) {
    this.viewPort.next(state);
  }

  getProfileData(): Observable<any> {
    return this.subject.asObservable();
  }

  setProfileData(data: any) {
    const loggedUser = this.localStorage.getItem('loggedUser');
    this.localStorage.setItem('loggedUser', loggedUser); // updating local storage
    this.subject.next(this.profile);
  }
}
