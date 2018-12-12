import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  isOldPasswordValid = true;
  isPasswordMatched = true;

  @Output() closeChangePassword = new EventEmitter<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  closeModal() {
    this.closeChangePassword.emit(true);
  }

  createForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  submitForm() {
    this.submitted = true;
    this.isPasswordMatched = true;
    this.isOldPasswordValid = true;
    const formValues = this.changePasswordForm.value;
    if (formValues.newPassword !== formValues.confirmPassword) {
      this.isPasswordMatched = false;
      return;
    }
    if (this.changePasswordForm.valid) {
      this.confirmOldPassword().subscribe(res => {
        this.changePassword();
      }, error => {
        this.isOldPasswordValid = false;
        return;
      });
    }
  }

  confirmOldPassword() {
    const formData = new FormData();
    formData.append('password', this.changePasswordForm.value.oldPassword);
    return this.userService.verifyPassword(formData);
  }

  changePassword() {
    const formData = new FormData();
    formData.append('old_password', this.changePasswordForm.value.oldPassword);
    formData.append('new_password', this.changePasswordForm.value.newPassword);
    return this.userService.changePassword(formData).subscribe(res => {
      this.closeModal();
    }, error => {
      console.log(error);
      return;
    });
  }

  get f() { return this.changePasswordForm.controls; }
}
