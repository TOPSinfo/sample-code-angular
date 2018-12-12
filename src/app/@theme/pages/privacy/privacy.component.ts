import { Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyComponent implements OnInit {
  pageContent: any = '';

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    const type = this.route.snapshot.paramMap.get('name');
    if (type && type.length > 0) {
      this.getPageContent(type + '');
    } else {
      this.pageContent = '<h3>Page Not Found 404</h3>';
    }
  }

  private getPageContent(type: string): void {
    const formData = new FormData();
    formData.append('type', type.trim());
    this.authenticationService.getHtmlFromServer(formData)
      .pipe(first())
      .subscribe(res => {
        this.pageContent = res['CONTENT'];
      }, error => {
        this.pageContent = error['MESSAGE'];
      });
  }
}
