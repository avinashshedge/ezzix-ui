import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportRoutes } from './report.routing';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserReportComponent } from './adminreport/userreport.component';
import { LoginReportComponent } from './adminreport/loginreport.component';
import { EmailUsageReportComponent } from './adminreport/emailusagereport.component';
import { SmsUsageReportComponent } from './adminreport/smsusagereport.component';
import { DeletedLeadReportComponent } from './adminreport/deletedleadreport.component';
import { LeadReportComponent } from './adminreport/leadreport.component';
import { ReportComponent } from './adminreport/report.component';
import { PresaleLeadCountReportComponent } from './presalereport/presaleleadcountreport.component';
import { PresaleLeadSourceReportComponent }
from './presalereport/presaleleadsourcereport.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ReportRoutes),
    ReactiveFormsModule,
    DemoMaterialModule,
    FlexLayoutModule ,
    NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [ ReportComponent,UserReportComponent,LoginReportComponent,EmailUsageReportComponent,SmsUsageReportComponent,LeadReportComponent,
    DeletedLeadReportComponent,PresaleLeadCountReportComponent,PresaleLeadSourceReportComponent]
})

export class ReportModule {

}
