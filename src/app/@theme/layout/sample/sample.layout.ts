import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd , Event } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
// TODO: move layouts into the framework
@Component({
  selector: 'app-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <app-header *ngIf="validStateForHeader && !validateForBooking"></app-header>
    <app-booking-header *ngIf="validateForBooking"></app-booking-header>
    <ng-content select="router-outlet"></ng-content>
    <app-footer></app-footer>
  `
})
export class SampleLayoutComponent implements OnInit {
  validStateForHeader = true;
  validateForBooking = false;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}
  ngOnInit() {
    this.router.events.subscribe((event: Event)  => {
      if (event instanceof NavigationEnd) {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        const stateName = currentRoute.snapshot.routeConfig.path;
        const url = event.url.replace('/', '');
        this.validateForBooking = stateName === 'treatments' || stateName === 'treatment' || stateName === 'therapists' || stateName === 'payment-confirmation';
        this.validStateForHeader = url !== 'login' && url !== 'signup' && url !== 'signup/:referal-code';
      }
    });
  }
}

