import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    LoginRoutingModule,
    NgbModule,
    TranslateModule
  ],
  entryComponents: [ForgotPasswordComponent]
})
export class LoginModule { }
