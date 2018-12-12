import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Inject } from '@angular/core';

export class CommonService {
    constructor(@Inject(LOCAL_STORAGE) private localStorage: any) {}

    setRedirectUrl(url: string): void {
        this.localStorage.setItem('redirectUrl', url);
    }

    getRedirectUrl() {
        return this.localStorage.getItem('redirectUrl');
    }

    clearRedirectUrl(): void {
        this.localStorage.removeItem('redirectUrl');
    }

    setReferenceId(referenceId: number) {
        this.localStorage.setItem('referenceId', referenceId);
      }
      getReferenceId() {
        this.localStorage.getItem('referenceId');
      }

      clearReferenceId(): void {
        this.localStorage.removeItem('referenceId')
      }
}
