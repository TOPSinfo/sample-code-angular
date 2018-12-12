import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { DataService } from '../../../core/services/data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs/observable/timer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class UserProfileComponent implements OnInit {
    userID: Number;
    userStatus: String;
    address = '';
    userBasicInfoForm: FormGroup;
    verifyMobileForm: FormGroup;
    userBasicInfo: object;
    isSaveBtnClicked = false;
    verifyMobileFormSubmitted = false;
    isRequestedForOtp = false;
    isMobileChanged = false;
    resendTimer = 20;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private dataService: DataService,
        private toastService: ToastrService,
        private authService: AuthenticationService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.createForm();
        this.getUserBasicDetails();
    }

    private createForm(): void {
        this.userBasicInfoForm = this.formBuilder.group({
            title: ['mr', Validators.required],
            firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+$')]],
            lastName: ['', Validators.pattern('[a-zA-Z]+$')],
            houseNumber: [{ value: '', disabled: true }, Validators.required],
            streetName: [{ value: '', disabled: true }, Validators.required],
            postalCode: [{ value: '', disabled: true }, Validators.required],
            mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('[^\s][a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
            subscription: ['', Validators.required],
        });

        this.verifyMobileForm = this.formBuilder.group({
            otp: ['', Validators.required],
            remember: false
        });
    }

    private setUsersBasicDetails(): void {
        const v = this.userBasicInfo;
        this.userBasicInfoForm.patchValue({
            title: v['title'].toLowerCase(),
            firstName: v['client_first_name'],
            lastName: v['client_last_name'],
            houseNumber: v['house_number'],
            streetName: v['street_name'],
            postalCode: v['post_code'],
            mobileNumber: v['contact_no'],
            email: v['email'],
            subscription: (v['is_subscribe_news'] === '0' ? false : true)
        });
        this.address = `${v['house_number']} ${v['street_name']} London, UK ${v['post_code']}`;
    }

    private getUserBasicDetails(): void {
        // this.userBasicInfo = this.authService.retrieveUserDetails();
        // this.setUsersBasicDetails();

        this.userService.getCurrentUserDetails().subscribe((res) => {
            this.userBasicInfo = res['home_client_data'][0];
            this.setUsersBasicDetails();
        }, (error) => {
        });
    }

    private saveUserProfile(): void {
        this.isSaveBtnClicked = true;

        if (this.userBasicInfoForm.valid) {
            const formData = new FormData();
            const userBasicInfoFormValues = this.userBasicInfoForm.value;
            formData.append('title', userBasicInfoFormValues['title']);
            formData.append('client_first_name', userBasicInfoFormValues['firstName']);
            formData.append('client_last_name', userBasicInfoFormValues['lastName']);
            formData.append('email', this.userBasicInfo['email']);
            formData.append('post_code', this.userBasicInfo['post_code']);
            formData.append('subscribe_news', (userBasicInfoFormValues['subscription'] ? '1' : '0'));

            this.userService.updateUserProfile(formData).subscribe(res => {
                this.toastService.success('Profile data saved. Please verify mobile to save.');
                const userDataObj = {};
                formData.forEach(function (value, key) {
                    userDataObj[key] = value;
                });

                this.authService.setProfileData(userDataObj);

                if (userBasicInfoFormValues['mobileNumber'] !== this.userBasicInfo['contact_no']) {
                    this.isMobileChanged = true;
                    this.sendOtp();
                }

            }, error => {

            });
        } else {
            const timeOut = timer(10);
            timeOut.subscribe(_ => {
                let target;
                target = document.querySelector('.error-label');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    saveMobileNumber() {

        const formData = new FormData();
        const userBasicInfoFormValues = this.userBasicInfoForm.value;

        formData.append('contact_no', userBasicInfoFormValues['mobileNumber']);
        formData.append('email', userBasicInfoFormValues['email']);
        formData.append('post_code', this.userBasicInfo['post_code']);

        this.userService.updateUserProfile(formData).subscribe(res => {

            this.authService.setProfileData({ contact_no: userBasicInfoFormValues['mobileNumber'] });


        }, error => {

        });
    }

    verifyOtp() {
        this.verifyMobileFormSubmitted = true;
        if (this.verifyMobileForm.valid) {
            const formData = new FormData();

            formData.append('mobile', this.userBasicInfoForm.value.mobileNumber.trim());
            formData.append('otp', this.verifyMobileForm.value.otp.trim());

            this.authService.verifyOTP(formData)
                .subscribe(res => {
                    this.toastService.success('Mobile verified successfully.');
                    this.saveMobileNumber();
                    this.isMobileChanged = false;
                }, error => {
                    console.log(error, 'error');
                    console.log('Invalid otp');
                });
        }
    }

    sendOtp() {
        this.isRequestedForOtp = true;

        const formData = new FormData();

        formData.append('mobile', this.userBasicInfoForm.value.mobileNumber.trim());
        formData.append('name', this.userBasicInfoForm.value.firstName.trim());

        this.authService.sendOTP(formData)
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

    openChangePassword(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          }, (reason) => {});
    }

    allowNumeric(event) {
        this.userBasicInfoForm.controls['mobileNumber'].setValue(event.value.replace(/[^0-9]/g, ''));
    }


    get f() { return this.userBasicInfoForm.controls; }
    get f2() { return this.verifyMobileForm.controls; }

}
