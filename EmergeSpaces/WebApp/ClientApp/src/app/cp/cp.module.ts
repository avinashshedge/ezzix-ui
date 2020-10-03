import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CPListComponent } from './cp-list.component';
import { CPQuickLeadComponent } from './cp-quick-lead.component';
import { DemoMaterialModule } from '../demo-material-module';
import { CPAssignToComponent } from './cp-assign.component';
import { CPDashboardComponent } from './cp-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CPReportComponent } from './cp-report.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const CP_Routes: Routes = [
  {
   path: '',
   component: CPDashboardComponent,
   data: {
       title: 'Leads',
   }
  },
   {
    path: 'cp-list',
    component: CPListComponent,
    data: {
        title: 'Leads',
    }
  },
  {
    path: 'cp-dashboard',
    component: CPDashboardComponent,
    data: {
        title: 'Leads',
    }
  },
  {
    path: 'cp-report',
    component: CPReportComponent,
    data: {
        title: 'Report',
    }
  }
 ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CP_Routes),
    FormsModule,FlexLayoutModule,DemoMaterialModule,
    ReactiveFormsModule,NgApexchartsModule,NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [CPQuickLeadComponent,CPAssignToComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  declarations: [CPListComponent,CPQuickLeadComponent,CPAssignToComponent,CPDashboardComponent,CPReportComponent]
})

export class CpModule {

}
