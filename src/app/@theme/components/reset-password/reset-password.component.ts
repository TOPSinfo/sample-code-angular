import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  serviceRes;
  loginData;
  submitted = false;
  constructor(private data: DataService, private toastrService: ToastrService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
    this.loginData = {};
    this.createForm();
  }

  ngOnInit() { }
  private createForm() {
    this.loginForm = this.formBuilder.group({
      confirmationPassowrd: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const obj = {
        email: this.route.snapshot.queryParamMap.get('email'),
        token: this.route.snapshot.queryParamMap.get('token'),
        confirmationPassowrd: this.loginForm.value.confirmationPassowrd,
        password: this.loginForm.value.password
      };
      this.authenticationService.resetPassword(obj)
        .pipe(first())
        .subscribe(res => {
          this.toastrService.success('Successfully Changed Password.');
          this.router.navigate(['']);
        });
    }
  }

  get f() { return this.loginForm.controls; }

  changeState(state) {
    this.data.changeState(state);
  }
}
