import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute , Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderConfig, NgxUiLoaderService, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  stateName;
  applyClass;
  config: NgxUiLoaderConfig;
  loaderStart = false;
  constructor(private translate: TranslateService, private ngxUiLoaderService: NgxUiLoaderService, private route: ActivatedRoute,
    private router: Router, private cdRef: ChangeDetectorRef) {
    translate.setDefaultLang('en');
    this.config = {
      // bgsColor: 'green',
      fgsColor: '#003157',
      pbColor: 'white',
      bgsPosition: POSITION.centerCenter,
      fgsPosition: POSITION.centerCenter,
      bgsSize: 0,
      fgsSize: 0,
      bgsType: SPINNER.circle,
      fgsType: SPINNER.circle,
      // logoSize: 100,
      // logoPosition: POSITION.centerCenter,
      pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
      pbThickness: 2, // progress bar thickness
      // logoUrl: 'assets/images/inner_round.png'
    };
  }

  ngAfterViewChecked() {
    this.ngxUiLoaderService.onStart.subscribe(arg => { this.loaderStart = true; this.cdRef.detectChanges(); });
    this.ngxUiLoaderService.onStop.subscribe(arg => { this.loaderStart = false; this.cdRef.detectChanges(); });
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(event => {
      let currentRoute = this.route.root;
      while (currentRoute.children[0] !== undefined) {
        currentRoute = currentRoute.children[0];
      }
      this.stateName = currentRoute.snapshot.data.title;
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
