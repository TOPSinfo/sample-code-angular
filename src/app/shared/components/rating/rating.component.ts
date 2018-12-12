import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: ` <ul class="rated-star">
  <li>
  <i class="fa fa-star" aria-hidden="true"></i>
  <i class="fa fa-star colored decimal" [ngStyle]="{width: checkWidth(rating,0)}"
    aria-hidden="true"></i>
</li>
<li>
  <i class="fa fa-star" aria-hidden="true"></i>
  <i class="fa fa-star colored decimal" [ngStyle]="{width: checkWidth(rating,1)}"
    aria-hidden="true"></i>
</li>
<li>
  <i class="fa fa-star" aria-hidden="true"></i>
  <i class="fa fa-star colored decimal" [ngStyle]="{width: checkWidth(rating,2)}"
    aria-hidden="true"></i>
</li>
<li>
  <i class="fa fa-star" aria-hidden="true"></i>
  <i class="fa fa-star colored decimal" [ngStyle]="{width: checkWidth(rating,3)}"
    aria-hidden="true"></i>
</li>
<li>
  <i class="fa fa-star" aria-hidden="true"></i>
  <i class="fa fa-star colored decimal" [ngStyle]="{width: checkWidth(rating,4)}"
    aria-hidden="true"></i>
</li>
</ul>`,
styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() rating: number;
  constructor() { }

  ngOnInit() {
  }

  checkWidth(width, index) {
    if (width > index && width < index + 1) {
      return this.calcPercentage(width);
    } else if (width === index || width > index) {
      return '100%';
    } else if (width < index) {
      return '0%';
    } else {
      return this.calcPercentage(width);
    }
    // return width = index || width-index = index ? "100%" : width > index ? this.calcPercentage(width) : '0%';
  }


  calcPercentage(width) {
    return String(Math.floor((width % 1) * 100)) + '%';
  }


}
