import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProfilePageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UserProfileComponent],
  entryComponents: []
})
export class ProfilePageModule { }
