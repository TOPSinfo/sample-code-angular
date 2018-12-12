import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapService } from '../../../core/services/google-map.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { locationSharedComponent } from '../../../pages/shared-components/location/location.component';
import { HeaderLengthComponent } from '../../../pages/shared-components/treatments/header-length/header-length.component';
import { HeaderAddOnComponent } from '../../../pages/shared-components/treatments/header-addOn/header-addOn.component';
import { BookingService } from '../../../core/services/booking.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../core/services/common.service';

declare var google;
@Component({
  selector: 'app-booking-header',
  templateUrl: './booking-header.component.html',
  styleUrls: ['./booking-header.component.css']
})
export class BookingHeaderComponent implements OnInit, OnDestroy {
  searchText: String;
  loggedIn = false;
  admin = false;
  userName: String;
  userImage: String;
  date: NgbDateStruct;
  bookingDetails: any = {
  };
  closeResult;
  profileData: any = {
    name: 'user',
    image: 'assets/images/user.jpg'
  };
  timePop: any;
  queryParams: any;
  popOverDate: any;
  treatmentId: any;
  addOnResult: any;
  duration;
  addOnVal;
  addressAllDetails = {};
  stateName: string;
  bookingFlow: string = 'home';
  constructor(private commonService: CommonService, config: NgbDatepickerConfig, private calendar: NgbCalendar, private googleService: GoogleMapService, private route: ActivatedRoute, private router: Router, private bookingService: BookingService, public authenticationService: AuthenticationService, private modalService: NgbModal) {
    const currentDate = new Date();
    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }
  @ViewChild(PerfectScrollbarComponent) ps?: PerfectScrollbarComponent;
  @ViewChild('pTime') public pTime: NgbPopover;
  ngOnInit() {
    this.setStateName();
    this.setUserProfileDate();
    this.setHeaderPrams();
    this.queryParams = { ...this.route.snapshot.queryParams };
    this.retrieveGoogleDetails();

    if (!this.queryParams['place_id']) {
      console.log(this.queryParams['place_id'], 'asdsad')
      this.bookingFlow = 'treatment';
    }
    // this.getAddOnDetails();
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

  setStateName() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        this.stateName = currentRoute.snapshot.routeConfig.path;
      });
  }

  setHeaderPrams() {
    this.route.queryParamMap.subscribe(queryParam => {
      this.queryParams = { ...queryParam['params'] };
      this.bookingDetails.treatmentId = this.queryParams['treatment_id'];
      this.popOverDate = this.popOverDate = this.queryParams['date'] ? this.queryParams['date'].split('/') : (new DatePipe('en').transform(new Date(), 'dd/MM/yyyy')).split('/');
      this.bookingDetails.time = this.queryParams['time'] ? this.queryParams['time'] : '';
      this.bookingDetails.duration = this.queryParams['duration'] ? this.queryParams['duration'] : '';
      this.bookingDetails.addOnId = this.queryParams['add_on_id'] ? this.queryParams['add_on_id'] : '';
      this.bookingDetails.addOnName = this.queryParams['add_on_id'] ? this.bookingDetails['addOnName'] : '';
      this.bookingDetails['therapists'] = this.queryParams['therapists'] ? this.queryParams['therapists'] : '';
      this.bookingDetails.date = { year: Number(this.popOverDate[2]), month: Number(this.popOverDate[1]), day: Number(this.popOverDate[0]) };
      if (this.bookingDetails.treatmentId) {
        this.getAddOnDetails();
      }
    });
  }

  ngOnDestroy() { }


  retrieveGoogleDetails() {
    if (this.queryParams['place_id']) {
      this.googleService.geocodePlaceId(this.queryParams['place_id']).then(res => {
        this.bookingDetails.address = res['formatted_address'];
        this.addressAllDetails = res;
      });
    } else {
      timer(1500).subscribe(_ => this.open());
    }
  }


  seletedTime(val) {
    this.pTime.close();
    this.timePop = val;
    let time24 = val.split(' ')
    let time24String = time24[0].split(':')
    if (parseInt(time24String[0]) != 12 && time24[1] == 'PM') {
      // console.log((parseInt(time24[0].split(':')[0]) + 12).toString())
      time24[0] = (parseInt(time24String[0]) + 12).toString() + ':' + time24String[1];
      // this.navigateToTherapist('time',12+(time24[0].split(':')[0]))
    }
    // else {
    this.navigateToTherapist('time', time24[0])
    // }
  }

  popoverDateChange(event, popover) {
    this.popOverDate = event.day + '/' + event.month + '/' + event.year;
    popover.close();
    this.navigateToTherapist('date', this.popOverDate);
  }

  scrollToBottom() {
    this.ps.directiveRef.scrollToBottom();
  }

  open() {
    const modalRef = this.modalService.open(locationSharedComponent, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.componentInstance.address = this.bookingDetails.address;
    modalRef.componentInstance.addressAllDetails = this.addressAllDetails;
    modalRef.result.then((result) => {
      if (result.status === 'save' && result.placeId) {
        this.bookingDetails.address = result.address;
        this.navigateToTherapist('place_id', result.placeId);
      }
    });
  }

  openLength() {
    if (this.bookingDetails.treatmentId) {
      const modalRef = this.modalService.open(HeaderLengthComponent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'length-addon-modal', });
      modalRef.componentInstance.duration = this.bookingDetails.duration;
      modalRef.result.then((result) => {
        if (result) {
          this.bookingDetails.duration = result;
          this.navigateToTherapist('duration', result);
        }
      });
    }
  }

  openAddOn(content) {
    if (this.bookingDetails.treatmentId && this.addOnResult) {
      const modalRef = this.modalService.open(HeaderAddOnComponent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'length-addon-modal' });
      modalRef.componentInstance.addOnResult = this.addOnResult;
      modalRef.componentInstance.addOnVal = this.bookingDetails.addOnId;
      modalRef.result.then((result) => {
        if (result) {
          const nameArr = [];
          const idArr = [];
          result.forEach((addOnData) => {
            if (addOnData.selected == true) {
              nameArr.push(addOnData.name);
              idArr.push(addOnData.id)
            }
          })
          this.bookingDetails.addOnName = nameArr.join(',');
          this.navigateToTherapist('add_on_id', idArr.join(','));
        }
      });
    }
  }

  getAddOnDetails() {
    if (this.bookingDetails.treatmentId) {
      this.bookingService.getAddOnTreatments(this.bookingDetails.treatmentId).subscribe(addOnResult => {
        this.addOnResult = addOnResult;
        const addOnIdArr = this.bookingDetails.addOnId.split(',');
        if (this.bookingDetails.addOnId) {
          const addOnNameArr = [];
          this.addOnResult.forEach(element => {
            if (addOnIdArr.includes(element.id)) {
              addOnNameArr.push(element.name)
            }
          });
          this.bookingDetails.addOnName = addOnNameArr.join(',');
        }
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateFindTherapistQuery(field, value, popover) {
    // this.bookingDetails.therapists = value
    popover.close();
    this.navigateToTherapist(field, value);
  }

  navigateToTherapist(field: string, value: any) {
    const queryParams = {};
    queryParams[field] = value;
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams,
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
  }


  logout() {
    const loggedUser = this.authenticationService.retrieveUserDetails();
    if (loggedUser && loggedUser.id) {
      this.authenticationService.logout()
        .pipe()
        .subscribe(_ => {
          this.loggedIn = false;
        });
    } else {
      this.authenticationService.resetStatus();
      this.loggedIn = false;
      this.router.navigate(['']);
    }
  }

}
