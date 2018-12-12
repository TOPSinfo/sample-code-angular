import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditAddressComponent } from './user-profile/edit-address/edit-address.component';
import { ProfilePageComponent } from './profile-page.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { WalletComponent } from './wallet/wallet.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { MetaGuard } from '@ngx-meta/core';

const routes: Routes = [
    {
        path: '',
        component: ProfilePageComponent,
        canActivateChild: [MetaGuard],
        children: [
            {
                path: 'profile',
                children: [
                    {
                        path: '',
                        component: UserProfileComponent,
                        data: {
                            meta: {
                                title: 'User Profile',
                                description: 'London Serenity'
                            }
                        }
                    },
                    {
                        path: 'address',
                        component: EditAddressComponent,
                        data: {
                            meta: {
                                title: 'Edit address',
                                description: 'London Serenity'
                            }
                        }
                    },
                ]
            },
            {
                path: 'appointments',
                pathMatch: 'full',
                component: AppointmentsComponent,
                data: {
                    meta: {
                        title: 'Appointments',
                        description: 'London Serenity'
                    }
                }
            },
            {
                path: 'wallet',
                pathMatch: 'full',
                component: WalletComponent,
                data: {
                    meta: {
                        title: 'Wallet',
                        description: 'London Serenity'
                    }
                }
            },
            {
                path: 'refer-friend',
                pathMatch: 'full',
                component: ReferFriendComponent,
                data: {
                    meta: {
                        title: 'refer-friend',
                        description: 'London Serenity'
                    }
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'profile'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfilePageRoutingModule { }
