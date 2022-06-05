import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlaceHolderDirective } from '../auth/placeHolder.directive';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown-directive.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropdownDirective,
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropdownDirective,
    CommonModule,
  ],
})
export class SharedModule {}
