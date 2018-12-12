import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { first } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { DataService } from '../../../../core/services/data.service';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapService } from '../../../../core/services/google-map.service';
import { ToastrService } from 'ngx-toastr';
declare var google: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  geocoder: any;

  signupFromStepOne: FormGroup;
  signupFromStepTwo: FormGroup;
  signupFromStepThree: FormGroup;
  signupFromStepFour: FormGroup;
  signupFromFb: FormGroup;
  clientId: string;

  formSubmitted: object;
  mapAttributes = {
    lat: 51.516871,
    lng: -0.103725,
    zoomControls: false
  };

  submitted: boolean;

  fbSubmitted = false;
  stepOneSubmitted = false;
  stepTwoSubmitted = false;
  stepThreeSubmitted = false;
  stepFourSubmitted = false;


  step: number;
  addressObj = {};
  resendTimer: number;
  isRequestedForOtp: boolean;  // flag for disable ui button once click for otp
  isSubmitted: boolean;        // flag for disable ui button once form submitted
  isGoogleFormatted = true;
  isPostalCodeDetectedByGoogle = true;
  isLondonCity = true;
  emailVerificationRequested = false;
  closeResult: string;
  searchOptions = {
    types: [],
    componentRestrictions: { country: 'UK' }
  };
  isLoginWithFb = false;
  isSignupWithTerms = true;
  activeTab = 'signup';
  modalReference: NgbModalRef;
  fbEmail: String;
  constructor(
    private route: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router,
    private googleService: GoogleMapService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.submitted = false;
    this.isRequestedForOtp = false;
    this.isSubmitted = false;
    this.formSubmitted = {
      1: true,
      2: false,
      3: false,
      4: false
    };

    this.resendTimer = 20;
    this.createForm();
    this.changeStep(1);
    this.signupFromStepOne.controls['referalcode'].setValue(this.route.snapshot.paramMap.get('referal-code'));
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.fbEmail = JSON.parse(params['user'])['email'];
        this.setLoginFormFbValues(JSON.parse(params['user']));
      }
    });
  }

  private setLoginFormFbValues(user) {
    this.isLoginWithFb = true;
    this.clientId = user.id;
    this.signupFromStepOne.controls['firstname'].setValue(user.name.split(' ')[0]);
    // this.signupFromStepOne.controls['firstname'].disable();
    // this.signupFromStepOne.controls['lastname'].disable();
    this.signupFromStepOne.controls['email'].disable();
    this.signupFromStepOne.controls['lastname'].setValue(user.name.split(' ')[1]);
    this.signupFromStepOne.controls['email'].setValue(user.email);
    this.signupFromStepOne.controls['agreeTermCondition'].setValue(true);
    this.signupFromStepOne.controls['interestedInOffers'].setValue(this.signupFromFb.value.interestedInOffers);
    this.signupFromStepOne.controls['password'].clearValidators();
    this.signupFromStepOne.controls['password'].updateValueAndValidity();
  }

  private createForm() {
    // step : 1
    this.signupFromStepOne = this.formBuilder.group({
      title: ['mr', Validators.required],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', Validators.required],
      lastname: ['', Validators.pattern('[[a-zA-Z]+$')],
      referalcode: [''],
      agreeTermCondition: [false, Validators.requiredTrue],
      interestedInOffers: [''],
      remember: true
    });

    // step : 2
    this.signupFromStepTwo = this.formBuilder.group({
      location: ['', Validators.required],
      remember: true
    });

    // step : 3
    this.signupFromStepThree = this.formBuilder.group({
      streetNumber: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      remember: true
    });

    // step : 3
    this.signupFromStepFour = this.formBuilder.group({
      otp: ['', Validators.required],
      remember: false
    });

    this.signupFromFb = this.formBuilder.group({
      agreeTermCondition: [false, Validators.requiredTrue],
      interestedInOffers: [''],
      remember: true
    });
  }

  openFbSignup(content) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  submitStepOne() {
    this.stepOneSubmitted = true;
    if (this.signupFromStepOne.valid) {
      this.emailVerificationRequested = true;
      if (this.isLoginWithFb) {
        this.formSubmitted[2] = true;
        this.changeStep(2);
      } else {
        this.verifyEmail().pipe(first())
          .subscribe(_ => {
            if (this.signupFromStepOne.value.referalcode) {
               this.verifyRefCode().pipe(first())
                .subscribe(_ => {
                   this.formSubmitted[2] = true;
                   this.changeStep(2);
                });
            } else {
               this.formSubmitted[2] = true;
                this.changeStep(2);
            }
          }, error => {
            this.emailVerificationRequested = false;
            console.log(error);
          });
      }
    }
  }


  submitFbSignup() {
    this.fbSubmitted = true;
    if (this.signupFromFb.valid) {
      this.modalReference.close();
      this.authenticationService.socialSignIn().then((response: any) => {
        if (response && response['is_login'] === '1') {
          this.toastrService.success('Successfull login');
          this.router.navigate(['']);
        } else {
          const user = {
            id: response.id,
            name: response.name,
            email: response.email
          };
          this.isSignupWithTerms = false;
          this.toastrService.info('Please signup');
          this.setLoginFormFbValues(user);
          const navigationExtras: NavigationExtras = {
            queryParams: {
              'user': JSON.stringify(user)
            }
          };
          this.router.navigate(['/signup'], navigationExtras);
        }
      });
    }
  }

  submitStepTwo() {
    this.stepTwoSubmitted = true;
    if (!(this.addressObj['postal_town'] && this.addressObj['postal_town'].toLowerCase() === 'london')) {
      this.isLondonCity = false;
      return;
    }
    if (!(this.addressObj['postal_code'] && this.addressObj['postal_code'].length > 0)) {
      this.isPostalCodeDetectedByGoogle = false;
      return;
    }
    if (!this.addressObj.hasOwnProperty('place_id')) {
      this.isGoogleFormatted = false;
      return;
    }

    if (this.signupFromStepTwo.valid) {
      this.formSubmitted[3] = true;
      this.changeStep(3);

      this.mapAttributes['lat'] = this.addressObj['lat'];
      this.mapAttributes['lng'] = this.addressObj['lng'];
      this.mapAttributes['iconUrl'] = '../assets/images/pin.png';

      this.signupFromStepThree.patchValue({
        streetNumber: this.addressObj['street_number'],
        street: this.addressObj['route'],
        postalCode: this.addressObj['postal_code'],
        city: this.addressObj['postal_town']
      });

    }
  }

  submitStepThree() {
    this.stepThreeSubmitted = true;

    if (this.signupFromStepThree.valid) {
      this.isRequestedForOtp = true;

      const formData = new FormData();

      formData.append('mobile', this.signupFromStepOne.value.mobile);
      formData.append('name', this.signupFromStepOne.value.firstname);

      this.authenticationService.sendOTP(formData)
        .pipe(first())
        .subscribe(res => {
          this.resendTimer = 20;
          const interval = timer(0, 1000);
          const tick = interval.subscribe(t => {
            this.resendTimer--;
            if (this.resendTimer === 0) {
              tick.unsubscribe();
              this.isRequestedForOtp = false;
              return;
            }
          });
        });
    }
  }

  changeStep(step: number): void {
    if (this.formSubmitted[step] === false) {
      return;
    }
    this.stepThreeSubmitted = false;
    this.step = step;
  }

  verifyOtp() {
    this.stepFourSubmitted = true;
    if (this.signupFromStepFour.valid) {
      this.isSubmitted = true;

      const formData = new FormData();

      formData.append('mobile', this.signupFromStepOne.value.mobile);
      formData.append('otp', this.signupFromStepFour.value.otp);
      formData.append('id', this.clientId);

      this.authenticationService.verifyOTP(formData)
        .pipe(first())
        .subscribe(res => {
          this.toastrService.success('Mobile verified successfully.');
          this.router.navigate(['']);
        }, error => {
          this.isSubmitted = false;
          console.log(error, 'error');
          console.log('Invalid otp');
        });
    }
  }

  verifyEmail() {
    const formData = new FormData();
    formData.append('email', this.signupFromStepOne.value.email);
    return this.authenticationService.verifyEmail(formData);
  }

  verifyRefCode() {
    const formData = new FormData();
    formData.append('referral_code', this.signupFromStepOne.value.referalcode);
    return this.authenticationService.verifyReferalCode(formData);
  }

  findMe() {
    this.googleService.findUserLocation().then(result => {
      this.addressObj = {...result};
      this.isPostalCodeDetectedByGoogle = true;
      this.isLondonCity = true;
      this.isGoogleFormatted = true;
      this.signupFromStepTwo.controls['location'].setValue(result['formatted_address']);
    }).catch(err => {
      console.log(err);
    });
  }

  getAddress(result) {
    result = this.googleService.retrieveDetails(result);
    this.addressObj = {...result};
      this.isPostalCodeDetectedByGoogle = true;
      this.isLondonCity = true;
      this.isGoogleFormatted = true;
      this.signupFromStepTwo.controls['location'].setValue(result['formatted_address']);
  }

  public submitForm(isMobileVerified = true): void {
    this.submitted = true;
    this.isSubmitted = true;
    if (this.signupFromStepThree.valid) {
      const formData = this.prepareSave(isMobileVerified);
      if (this.isLoginWithFb) {
        this.authenticationService.updateProfile(formData)
          .pipe(first())
          .subscribe(res => {
            this.toastrService.success('Registration successful.');
            this.formSubmitted[4] = true;
            this.formSubmitted[3] = false;
            this.formSubmitted[2] = false;
            this.formSubmitted[1] = false;
            this.changeStep(4);
          }, error => {
            this.isSubmitted = false;
            console.log(error, 'error');
          });
      } else {
        this.authenticationService.signup(formData)
          .pipe(first())
          .subscribe(res => {
            this.toastrService.success('Registration successful. Activation verification email has been sent to registered email.');
            this.clientId = res['data']['last_id'];
            this.formSubmitted[4] = true;
            this.formSubmitted[3] = false;
            this.formSubmitted[2] = false;
            this.formSubmitted[1] = false;
            this.changeStep(4);
          }, error => {
            this.isSubmitted = false;
            console.log(error, 'error');
          });
      }
    }
  }

  get f1() { return this.signupFromStepOne.controls; }
  get f2() { return this.signupFromStepTwo.controls; }
  get f3() { return this.signupFromStepThree.controls; }
  get f4() { return this.signupFromStepFour.controls; }
  get fbForm() { return this.signupFromFb.controls; }

  changeState(state) {
    this.data.changeState(state);
  }

  private prepareSave(isMobileVerified: boolean): any {
    const input = new FormData();

    input.append('title', this.signupFromStepOne.value.title);
    input.append('client_first_name', this.signupFromStepOne.value.firstname);
    input.append('client_last_name', this.signupFromStepOne.value.lastname);
    input.append('contact_no', this.signupFromStepOne.value.mobile);
    input.append('email', this.signupFromStepOne.value.email || this.fbEmail);
    input.append('password', this.signupFromStepOne.value.password);
    input.append('referral_code', this.signupFromStepOne.value.referalcode);
    input.append('term_accepted', '1');
    input.append('subscribe_news', (this.signupFromStepOne.value.interestedInOffers ? '1' : '0'));

    input.append('post_code', this.signupFromStepThree.value.postalCode);
    input.append('street_name', this.signupFromStepThree.value.street);
    input.append('house_number', this.signupFromStepThree.value.streetNumber);

    input.append('device_type', '4');
    input.append('mobile_verified', (isMobileVerified ? '1' : '0'));
    input.append('place_id', this.addressObj['place_id']);
    input.append('place_name', this.addressObj['place_name']);

    return input;
  }

  allowNumeric(event) {
    this.signupFromStepOne.controls['mobile'].setValue(
      event.value.replace(/[^0-9]/g, '')
    );
  }

  resetValidationFlags() {
    this.isGoogleFormatted = true;
    this.isPostalCodeDetectedByGoogle = true;
    this.isLondonCity = true;
  }

}

