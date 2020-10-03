import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceptionFormComponent } from './reception-form.component';
import { Routes, Router, RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

export const Reception_Routes: Routes = [
  {
   path: '',
   component: ReceptionFormComponent,
   data: {
       title: 'Inquiry Form',
   }
  },
  {
    path: 'reception',
    component: ReceptionFormComponent,
    data: {
        title: 'Inquiry Form',
    }
   }
 ];

@NgModule({
  declarations: [ReceptionFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(Reception_Routes),
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})

export class ReceptionModule { }
