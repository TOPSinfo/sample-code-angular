import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-window',
  template: `<div class="confirm-content">
  <p class="label">{{confirmText}}</p>
  <div class="button-group">
    <button class="btn btn-golden" type="button" (click) = "confirmed()">Yes</button>
    <button class="btn btn-golden" type="button" (click) = "denied()">No</button>
  </div></div>`,
  styleUrls: []
})
export class ConfirmWindowComponent implements OnInit {
  @Input() confirmText: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  confirmed() {
    this.activeModal.close();
  }

  denied() {
    this.activeModal.dismiss();
  }

}
