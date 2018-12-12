import { Directive , Input , ElementRef,HostBinding,OnChanges} from '@angular/core';
enum CardType { VISA = 'visa-small', MASTERCARD = 'mastercard-small', AMERICAN_EXPRESS = 'american-express', UNKNOWN = 'unknown'}
@Directive({
  selector: '[ccLogo]'
})
export class CreditCardImageDirective implements OnChanges {
  @Input()cardType: string;
  @HostBinding('src')
imageSource;
cardIcons = {
  VISA_CREDIT: 'assets/images/card-images/visa-small.png',
  VISA: 'assets/images/card-images/visa-small.png',
  VISA_DEBIT: 'assets/images/card-images/visa-small.png',
  VISA_CORPORATE_CREDIT: 'assets/images/card-images/visa-small.png',
  VISA_CORPORATE_DEBIT: 'assets/images/card-images/visa-small.png',
  MASTERCARD_CREDIT: 'assets/images/card-images/mastercard-small.png',
  MASTERCARD_DEBIT: 'assets/images/card-images/mastercard-small.png',
  MASTERCARD: 'assets/images/card-images/mastercard-small.png',
  MASTERCARD_CORPORATE_CREDIT:
    'assets/images/card-images/mastercard-small.png',
  MASTERCARD_CORPORATE_DEBIT:
    'assets/images/card-images/mastercard-small.png',
  MAESTRO: 'assets/images/card-images/maestro-small.png',
  AMEX: 'assets/images/card-images/amex-small.png',
  CARTEBLEUE: 'assets/images/mastercard.png',
  JCB: 'assets/images/mastercard.png',
  DINERS: 'assets/images/mastercard.png'
};
  constructor(elr:ElementRef) {
    elr.nativeElement.style.background = 'red';
}
ngOnChanges() {
  this.imageSource = this.getCardImageUrl();
}

getCardImageUrl(): CardType {
  if (this.cardType) {
    return this.cardIcons[this.cardType];
  }
  return this.cardIcons[0];
}

}
