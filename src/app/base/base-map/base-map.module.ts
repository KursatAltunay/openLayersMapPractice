import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from './base-map.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    BaseMapComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    BaseMapComponent
  ]

})
export class BaseMapModule { }
