import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
    userID: Number;
    userStatus: String;
    userForm: FormGroup;


    constructor() {

    }

    ngOnInit() {

    }

}
