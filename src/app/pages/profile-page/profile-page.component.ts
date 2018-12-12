import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ViewportScroller} from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/components/image-cropper/image-cropper.component';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../core/services/data.service';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $: any;
declare var StickySidebar: any;
@HostListener('scroll', ['$event'])
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit, AfterViewInit {
  userImage: String;
  userName: String;
  croppedImage: any = '';
  closeResult: string;
  fixedClass = false;
  footerPort = false;
  xTop;
  @ViewChild('fixedBox') fixedBox: ElementRef;
  constructor(
    private scroll: ViewportScroller,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private userService: UserService,
    private toastService: ToastrService,
    private dataService: DataService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(res => {
      const userData = JSON.parse(res);
      this.userName = `${userData.client_first_name} ${
        userData.client_last_name
      }`;
      this.userImage = userData.profile_pic;
    });
    // this.dataService.footerViewPort.subscribe(res => {
    //   this.footerPort = res;
    // });
  }
  ngAfterViewInit() {
    this.xTop = $('#fixedBox').offset().top;
  }

  openUploadDialog() {
    this.modalService.open(ImageCropperComponent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'upload-image-modal'}).result.then(result => {
          console.log(result);
          if (result.image == null) { return; }

          const formData = new FormData();
          formData.append('profile_pic', result.file);
          this.userService.changeProfilePicture(formData).subscribe(
            res => {
              console.log(res);
              const image = result.image;
              this.toastService.success('Profile image updated successfully.');
              this.authService.setProfileData({ profile_pic: image });
              // this.profileSrc = image;
            },
            error => {
              console.log(error);
            }
          );

          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          console.log(reason);
          this.closeResult = `Dismissed`;
        }
      );
  }

  logout() {
    const loggedUser = this.authService.retrieveUserDetails();
    if (loggedUser && loggedUser.id) {
      this.authService
        .logout()
        .pipe()
        .subscribe(_ => {
          this.router.navigate(['']);
        });
    } else {
      this.authService.resetStatus();
      this.router.navigate(['']);
    }
  }

  onScroll($event: any): void {
    const scroll = $(window).scrollTop();
    const bottomReached = $(window).scrollTop() + $(window).height() >= $(document).height();
    this.checkFooterInView();
    if (scroll >= this.xTop && !this.footerPort && !bottomReached) {
      this.fixedClass = true;
    } else {
      this.fixedClass = false;
    }
  }

  checkFooterInView() {
    if ($(window).scrollTop() + $(window).height() > $('.footer').offset().top) {
      this.footerPort = true;
    } else {
      this.footerPort = false;
    }
  }
}
