import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParfumsComponent } from './parfums.component';
import { MissDiorComponent } from '../miss-dior/miss-dior.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MissDiorComponent,
    ParfumsComponent
  ],
})
export class ParfumsModule { }
