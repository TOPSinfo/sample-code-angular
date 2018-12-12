import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { GoogleMapService } from '../../../../core/services/google-map.service';
declare var google: any;
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  geocoder: any;
  step: number;
  editStepOneForm: FormGroup;
  editStepTwoForm: FormGroup;
  addressObj = {};
  stepOneSubmitted = false;
  stepTwoSubmitted = false;
  isGoogleFormatted = true;
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
    public location: Location,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private googleService: GoogleMapService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.step = 1;
    this.createForm();
    this.getUserBasicDetails();
  }

  private getUserBasicDetails(): void {
    this.userService.getCurrentUserDetails().subscribe(res => {
      const v = res['home_client_data'][0];
      this.editStepOneForm.controls['location'].setValue(
        `${v['house_number']} ${v['street_name']} London, UK ${v['post_code']}`
      );
    });
  }

  createForm() {
    this.editStepOneForm = this.formBuilder.group({
      location: ['', Validators.required],
      remember: true
    });

    this.editStepTwoForm = this.formBuilder.group({
      streetNumber: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
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
    if (
      this.editStepOneForm.controls['location'].value &&
      !this.addressObj.hasOwnProperty('place_id')
    ) {
      this.isGoogleFormatted = false;
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
    }
  }

  submitForm() {
    this.stepTwoSubmitted = true;
    const formData = this.prepareSave();
    this.authenticationService.updateProfile(formData).subscribe(
      res => {
        this.toastService.success('Succeed');
        const userDataObj = {};
        formData.forEach(function(value, key) {
          userDataObj[key] = value;
        });
        this.authenticationService.setProfileData(userDataObj);

        this.router.navigate(['/my-account/profile']);
      },
      error => {
        console.log(error, 'error');
      }
    );
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
}
