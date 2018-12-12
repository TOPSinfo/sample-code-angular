import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchText: String;
  loggedIn = false;
  admin = false;
  userName: String;
  userImage: String;
  profileData: any = {
    name : 'user',
    image : 'assets/images/user.jpg'
  };

  constructor(@Inject(PLATFORM_ID) private platformId, private auth: AuthGuard, private route: ActivatedRoute, private router: Router, private data: DataService, public authenticationService: AuthenticationService) {
}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.auth.isLoggedIn()) {
        this.setUserInfo();
      } else {
        this.setUserInfo();
      }
    }
    this.setUserProfileDate();
  }

  setUserProfileDate() {
    this.profileData = this.authenticationService.currentUser.subscribe(res => {
      const userData = JSON.parse(res);
      this.userName = `${userData.client_first_name} ${userData.client_last_name}`;
      this.userImage = userData.profile_pic || 'assets/images/no_image.jpg';
    });
    this.authenticationService.isLoggedIn.subscribe(res => {
      this.loggedIn = res ? true : false;
    });
  }

  logout() {
    const loggedUser = this.authenticationService.retrieveUserDetails();
    if (loggedUser && loggedUser.id) {
      this.authenticationService.logout()
      .pipe()
      .subscribe(_ => {
        this.loggedIn = false;
        this.router.navigate(['']);
      });
    } else {
      this.authenticationService.resetStatus();
      this.loggedIn = false;
      this.router.navigate(['']);
    }
  }

  changePasssword() {
    this.router.navigate(['/set-password']);
  }

  onSearch(text) {
    this.data.changeMessage(text);
  }

  setUserInfo() {
    const loggedUser = this.authenticationService.retrieveUserDetails();
    if (loggedUser) {
      this.loggedIn = true;

      this.authenticationService.setProfileData({
        client_first_name : loggedUser.client_first_name,
        client_last_name : loggedUser.client_last_name,
        profile_pic : loggedUser.profile_pic ? loggedUser.profile_pic : 'assets/images/no_image.jpg'
      });
      this.authenticationService.setCurrentUser(loggedUser, this.authenticationService.getToken());

    } else {
      this.loggedIn = false;
    }
  }

}
