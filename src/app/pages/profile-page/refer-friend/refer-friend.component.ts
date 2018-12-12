import { Component, OnInit } from '@angular/core';
import { LocationStrategy  } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import DeepLink from '@iamdew/deep-link';

@Component({
  selector: 'app-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.css']
})
export class ReferFriendComponent implements OnInit {
  baseUrl: string;
  referralCode: string;
  shareUrl: string;
  deepLink = new DeepLink({
    playStore: 'https://play.google.com/store/apps/details?id=com.londonserenityclient',
});
  constructor(private userService: UserService, private location: LocationStrategy, private toastService: ToastrService) { }

  ngOnInit() {
    this.deepLink.openApp({
      appScheme: 'ls_client://', // Required
      alsoUseWebUrlOnMobile: true, // Optional (Default: true)
      openStoreWhenNoInstalledTheApp: false // Optional (Default: true)
    });
    this.userService.getReferralCode().subscribe(res => {
      this.referralCode = res['REFERRAL_CODE'];
      this.shareUrl = `https://booking.londonserenity.com/web/dist/#/signup/${this.referralCode}`;
    });
  }
  onCopySuccess() {
    this.toastService.info('Copied to clipboard.');
  }

}
