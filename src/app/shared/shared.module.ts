import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileDropModule } from 'ngx-file-drop';

import { ImageCropperComponent, ConfirmWindowComponent } from './components';
import { RatingComponent } from './components/rating/rating.component';

const COMPONENTS = [
  ImageCropperComponent,
  ConfirmWindowComponent,
  RatingComponent
];

const BASE_MODULES = [FormsModule, ReactiveFormsModule, CommonModule, ImageCropperModule, FileDropModule];
@NgModule({
  exports: [...BASE_MODULES, ...COMPONENTS],
  declarations: [...COMPONENTS],
  imports: [
    ...BASE_MODULES
  ],
  entryComponents: [...COMPONENTS]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [],
    };
  }
}
