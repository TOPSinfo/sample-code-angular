import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.css'],
    providers: [NgbRatingConfig]
})

export class ReviewComponent implements OnInit {
    @Input() addReview: boolean;
    @Input() viewReview: boolean;
    @Input() addGratuity: boolean;
    @Input() viewGratuity: boolean;
    @Input() reviewData;
    review;
    currentRate: any;
    gratuity;
    constructor(
        private toastrService: ToastrService,
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) {}
    ngOnInit() {
        console.log(this.reviewData);
        this.currentRate = this.viewReview ? this.reviewData.rating : 0;
        this.review = this.viewReview ? this.reviewData.review : '';
        // this.config.readonly = true;
    }
    changeRate() {
    }
    submitReview() {
        const formData = new FormData();
        formData.append('booking_id', this.reviewData.id);

        if (this.currentRate) {
            formData.append('rating', this.currentRate);
        }
        if (this.review) {
            formData.append('review', this.review);
        }
        if (this.gratuity) {
            formData.append('gratuity_amount', this.gratuity);
        }
        this.userService.addReview(formData).subscribe(
            res => {
              if (res.FLAG) {
                this.reviewData.rating = this.currentRate;
                this.reviewData.review = this.review;
                this.reviewData.gratuity = this.gratuity;
                this.toastrService.success(res.MESSAGE);
              } else {
                this.toastrService.error(res.MESSAGE);
              }
            },
            error => {
              console.log('-------error', error);
            }
        );
        this.activeModal.close(this.reviewData);
    }
}
