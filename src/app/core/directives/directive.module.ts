import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingDirective } from './rating.directive';
import { CreditCardImageDirective } from './cc-logo.directive';

const DIRECTIVES = [
    RatingDirective,
    CreditCardImageDirective
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...DIRECTIVES,
    ],
    declarations: [...DIRECTIVES],
    exports: [...DIRECTIVES]
})
export class DirectiveModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: DirectiveModule,
            providers: [
                ...DIRECTIVES,
            ],
        };
    }
}
