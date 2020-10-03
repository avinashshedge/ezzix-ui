import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SaleRoutes } from './sales.routing';
import { SalesLeadGridComponent } from './leads/sales-lead-grid.component';
import { SalesDashboardComponent } from './dashboard/sales-dashboard.component';
import { SalesTaskDashboardComponent } from './task/sales-task-dashboard.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(SaleRoutes),
    ReactiveFormsModule,
    DemoMaterialModule,
    FlexLayoutModule ,
    DragDropModule,
    ChartistModule,
    ChartsModule,
    NgApexchartsModule,
    QuillModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [ SalesLeadGridComponent,SalesDashboardComponent,SalesTaskDashboardComponent ]
})

export class SalesModule {

}
