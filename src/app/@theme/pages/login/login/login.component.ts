import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../../core/services/data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../../../core/guard/auth.guard';
import { CommonService } from '../../../../core/services/common.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  serviceRes;
  loginData;
  appBaseUrl: string = environment.appBaseUrl;
  url: any;
  closeResult: string;
  submitted = false;
  @Output() closeLogin = new EventEmitter<string>();
  constructor(private auth: AuthGuard, private modalService: NgbModal, private data: DataService, private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private commonService: CommonService) {
    this.loginData = {};
    this.createForm();
  }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: true
    });
  }

  loginWithOptions() {
    this.authenticationService.socialSignIn().then((response: any) => {
      if (response && response['is_login'] === '1') {
        this.toastrService.success('Successfully Login');
        this.router.navigate(['']);
      } else {
        const user = {
          id: response.id,
          name: response.name,
          email: response.email
        };
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'user': JSON.stringify(user)
          }
        };
        this.toastrService.info('Please signup');
        this.router.navigate(['/signup'], navigationExtras);
      }
    });
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const formDetails = this.prepareSave();
      this.authenticationService.login(formDetails)
        .pipe(first())
        .subscribe(res => {
          this.toastrService.success('Successfully Login');
          let redirectUrl = '';
          if (this.commonService.getRedirectUrl()) {
            redirectUrl = this.commonService.getRedirectUrl();
            this.commonService.clearRedirectUrl();
          }
          this.router.navigateByUrl(redirectUrl);
        });
    }
  }

  private prepareSave(): any {
    const input = new FormData();
    input.append('email', this.loginForm.value.email);
    input.append('password', this.loginForm.value.password);
    input.append('device_type', '4');
    return input;
  }
  changeState(state) {
    this.data.changeState(state);
  }


  closePopover() {
    this.closeLogin.emit('true');
  }
}



