import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeadRoutes } from './lead.routing';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LeadGridComponent } from './lead-grid/lead-grid.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ActivityDetailsComponent } from './timeline/activity_details.component';
import { TaskDetailsComponent } from './timeline/task_details.component';
import { NotesDetailsComponent } from './timeline/notes_details.component';
import { ActivityComponent } from './timeline/activity.component';
import { NotesComponent } from './timeline/notes.component';
import { TaskComponent } from './timeline/task.component';
import { LeadDetailsComponent } from './timeline/lead_details.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BulkUpdateComponent } from './lead-action/bulkupdate.component';
import { ChangeStageComponent } from './lead-action/changestage.component';
import { SMSComponent } from './lead-action/sms.component';
import { EmailComponent } from './lead-action/email.component';
import { ChangeOwnerComponent } from './lead-action/changeowner.component';
import { QuillModule } from 'ngx-quill';
import { PresaleDashboardComponent } from './dashboard/presale-dashboard.component';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatOptionSelectAllComponent } from '../mat-option-select-all/mat-option-select-all.component';
import { TaskDashboardComponent } from './task/task-dashboard.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LeadRoutes),
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
  entryComponents: [
    ChangeOwnerComponent,BulkUpdateComponent,ChangeStageComponent,SMSComponent,EmailComponent,
    ActivityComponent,NotesComponent,TaskComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [ MatOptionSelectAllComponent,
    PresaleDashboardComponent,LeadGridComponent,TimelineComponent,ActivityDetailsComponent,TaskDetailsComponent,LeadDetailsComponent,TaskDashboardComponent,
                  NotesDetailsComponent,ActivityComponent,NotesComponent,TaskComponent,
                  ChangeOwnerComponent,BulkUpdateComponent,ChangeStageComponent,SMSComponent,EmailComponent]
})

export class LeadModule {

}
