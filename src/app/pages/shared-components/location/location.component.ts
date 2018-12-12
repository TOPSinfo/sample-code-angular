import { NgModule, ViewChild } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Location } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapService } from '../../../core/services/google-map.service';
declare var google;
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class locationSharedComponent implements OnInit {
  geocoder: any;
  step: number;
  editStepOneForm: FormGroup;
  editStepTwoForm: FormGroup;
  addressObj = <any>{};
  addressAllDetails = <any>{};
  stepOneSubmitted = false;
  stepTwoSubmitted = false;
  isGoogleFormatted = true;
  address: string;
  placeId: string;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  isPostalCodeDetectedByGoogle = true;
  isLondonCity = true;
  mapAttributes = {
    lat: 51.516871,
    lng: -0.103725,
    zoomControls: false,
    zoom: 13
  };
  searchOptions = {
    types: [],
    componentRestrictions: { country: 'UK' }
  };

  constructor(
    private googleService: GoogleMapService,
    private location: Location,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.step = 1;
    this.createForm();
    this.retrieveGoogleDetails();
    //this.getUserBasicDetails();
  }

  retrieveGoogleDetails() {
    const queryParams = {...this.route.snapshot.queryParamMap};
    if (queryParams['params']['place_id']) {
      this.placeId = queryParams['params']['place_id'];
      this.googleService.geocodePlaceId(queryParams['params']['place_id']).then(result => {
        this.addressObj = {...result};
        console.log(this.addressObj,'addressObj')
        this.isPostalCodeDetectedByGoogle = true;
        this.isLondonCity = true;
        this.isGoogleFormatted = true;
        this.editStepOneForm.controls['location'].setValue(result['formatted_address']);
      });
    }
  }


  private getUserBasicDetails(): void {
    this.userService.getCurrentUserDetails().subscribe(res => {
      const v = res['home_client_data'][0];
      this.editStepOneForm.controls['location'].setValue(
        `${v['house_number']} ${v['street_name']} London, UK ${v['post_code']}`
      );
    });
    console.log('this.editStepOneForm.controls', this.editStepOneForm.controls)
  }

  createForm() {
    this.editStepOneForm = this.formBuilder.group({
      location: [this.address || '', Validators.required],
      remember: true
    });
    this.editStepTwoForm = this.formBuilder.group({
      streetNumber: [this.addressObj.street_number || '', Validators.required],
      street: [this.addressObj.route || '', Validators.required],
      postalCode: [this.addressObj.postal_code || '', Validators.required],
      city: [this.addressObj.postal_town || '', Validators.required],
      remember: true
    });
  }

  findMe() {
    this.googleService.findUserLocation().then(result => {
      this.addressObj = {...result};
      this.isPostalCodeDetectedByGoogle = true;
      this.isLondonCity = true;
      this.isGoogleFormatted = true;
      this.editStepOneForm.controls['location'].setValue(result['formatted_address']);
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
      this.editStepOneForm.controls['location'].setValue(result['formatted_address']);
  }


  submitStepOne() {
    this.stepOneSubmitted = true;
    if ((this.editStepOneForm.controls['location'].value && !this.addressObj.hasOwnProperty('place_id'))) {
      this.isGoogleFormatted = false;
      return;
    }
    if (!(this.addressObj['postal_town'] && this.addressObj['postal_town'].toLowerCase() === 'london')) {
      this.isLondonCity = false;
      return;
    }
    if (!(this.addressObj['postal_code'] && this.addressObj['postal_code'].length > 0)) {
      this.isPostalCodeDetectedByGoogle = false;
      return;
    }
    if (this.editStepOneForm.valid) {
      this.step = 2;

      this.mapAttributes['lat'] = this.addressObj['lat'];
      this.mapAttributes['lng'] = this.addressObj['lng'];
      this.editStepTwoForm.patchValue({
        streetNumber: this.addressObj['street_number'],
        street: this.addressObj['route'],
        postalCode: this.addressObj['postal_code'],
        city: this.addressObj['postal_town']
      });
      console.log('this.editStepTwoForm', this.editStepTwoForm)
    }
  }

  submitForm() {
    this.stepTwoSubmitted = true;
    console.log('this.editStepTwoForm', this.editStepTwoForm)
    const formData = this.prepareSave();
    console.log('formData', formData);
    const userDataObj = {};
    formData.forEach(function (value, key) {
      userDataObj[key] = value;
    });
    console.log('userDataObj', userDataObj)
    // this.authenticationService.updateProfile(formData).subscribe(
    //     res => {
    //         this.toastService.success('Succeed');
    //         const userDataObj = {};
    //         formData.forEach(function(value, key) {
    //             userDataObj[key] = value;
    //         });
    //         this.authenticationService.setProfileData(userDataObj);

    //         this.router.navigate(['/my-account/profile']);
    //     },
    //     error => {
    //         console.log(error, 'error');
    //     }
    // );
  }

  private prepareSave(): FormData {
    const input = new FormData();
    const userData = this.authenticationService.retrieveUserDetails();

    input.append('post_code', this.editStepTwoForm.value.postalCode);
    input.append('street_name', this.editStepTwoForm.value.street);
    input.append('email', userData.email);
    input.append('house_number', this.editStepTwoForm.value.streetNumber);
    input.append('place_id', this.addressObj['place_id']);
    input.append('place_name', this.addressObj['place_name']);

    return input;
  }

  get f1() {
    return this.editStepOneForm.controls;
  }
  get f2() {
    return this.editStepTwoForm.controls;
  }

  submitAndSave() {
    const obj = {
      status: 'save',
      address : this.editStepOneForm.controls['location'].value,
      placeId: this.addressObj['place_id']
    }
    this.activeModal.close(obj);
  }

  resetValidationFlags() {
    console.log('adasdsad');
    this.placeId = '';
    this.addressObj = {};
    this.isGoogleFormatted = true;
    this.isPostalCodeDetectedByGoogle = true;
    this.isLondonCity = true;
  }


}