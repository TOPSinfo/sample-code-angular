import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../../core/services/data.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  serviceRes;
  loginData;
  appBaseUrl: string = environment.appBaseUrl;
  submitted = false;
 @Output() closeForgotPassword = new EventEmitter<boolean>();
  constructor(private data: DataService, private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {
    this.loginData = {};
    this.createForm();
  }

  ngOnInit() { }
  private createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    this.submitted = true;
    const formDetails = this.prepareSave();
    if (this.forgotPasswordForm.valid) {
    this.authenticationService.forgotPasssword(formDetails)
      .pipe(first())
      .subscribe(_ => {
        this.toastrService.success('Successfully Sent Email To Reset Password.');
        this.closeModal();
      });
    }
  }

  get f() { return this.forgotPasswordForm.controls; }

  private prepareSave(): any {
    const input = new FormData();
    input.append('email', this.forgotPasswordForm.value.email);
    return input;
  }

  changeState(state) {
    this.data.changeState(state);
  }

  closeModal() {
    this.closeForgotPassword.emit(true);
  }

}
