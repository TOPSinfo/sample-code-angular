import { Component, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/map';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { GoogleMapService } from '../../../core/services/google-map.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  searchOptions = {
    types: [],
    componentRestrictions: { country: 'UK' }
  };

  searchText: string;
  page = 1;
  throttle = 300;
  scrollDistance = 1.5;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  slideConfig = {
    centerMode: true,
    infinite: false,
    centerPadding: '0px',
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: true
        }
      }
    ]
  };

  /**/

  slideConfigClient = {
    infinite: false,
    centerPadding: '60px',
    slidesToShow: 5,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        dots: true
      }
    },
    ]
  };
  addressObj: any = {};
  private isNextDay;
  constructor(private toastrService: ToastrService, private authServiceService: AuthenticationService, private router: Router,private googleService: GoogleMapService) {
  }
  ngAfterViewInit() {
    this.setLoggedUserAddress();
  }
  setLoggedUserAddress() {
    this.authServiceService.currentUser.subscribe(res => {
      res = JSON.parse(res);
      this.googleService.geocodePlaceId(res['google_place_id']).then(result => {
        this.addressObj = {...result};
        this.searchText = result['formatted_address'];
      }).catch(resu => {
        console.log(resu);
      });
   });
  }
  onScrollDown() {
    this.page = this.page + 1;
    this.ngAfterViewInit();
  }

  clearSearch() {
    this.addressObj = {};
    this.searchText = '';
  }

  handleAddressChange(address) {
    this.addressObj = {};
    this.addressObj['lat'] = address.geometry.location.lat();
    this.addressObj['lng'] = address.geometry.location.lng();
    this.addressObj['place_id'] = address.place_id;
    this.addressObj['place_name'] = address.name;
    this.addressObj['postal_code'] = address['address_components'].filter(val => val['types'][0] === 'postal_code')[0]['long_name'];
  }

  submitSearch() {
    if (this.addressObj && this.addressObj['postal_code'] && this.addressObj['place_id']) {
      this.navigateToTreatment();
    } else {
      this.toastrService.info('Please enter your address.');
    }
  }

  private navigateToTreatment() {
    const timeSlot = this.getTimeSlot();
    const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
    const dateNow = new Date();
    const date =  new DatePipe('en').transform(this.isNextDay ? nextDay : dateNow, 'dd/MM/yyyy');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'place_id': this.addressObj['place_id'],
        'postal_code': this.addressObj['postal_code'],
        'date': date,
        'time': timeSlot,
        'therapists': '1'
      }
    };
    this.router.navigate(['/booking'], navigationExtras);
  }

  private getTimeSlot() {
    const timeSlot = new Date();
    const minute = timeSlot.getMinutes();
    if (minute <= 15) {
      timeSlot.setMinutes(0 + 90);
    } else if (minute > 15 && minute <= 45) {
     timeSlot.setMinutes(0 + 120);
    } else if (minute > 45) {
    timeSlot.setMinutes(0 + 150);
    }
    const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
    this.isNextDay = timeSlot > nextDay;
    let minutes = timeSlot.getMinutes().toString();
    minutes = minutes.length === 1 ? minutes + '0' : minutes;
    return timeSlot.getHours() + ':' + minutes;
  }
}
