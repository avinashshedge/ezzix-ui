import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutes } from './admin.routing';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserGridComponent } from './user/user-grid/user-grid-component';
import { UserActivityComponent } from './user/user-activity/user-activity-component';
import { CompanyComponent } from './company/company.component';
import { ProjectGridComponent } from './project/project-grid/project-grid-component';
import { ProjectActivityComponent } from './project/project-activity/project-activity-component';
import { OfficeGridComponent } from './office/office-grid/office-grid-component';
import { OfficeActivityComponent } from './office/office-activity/office-activity-component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RuleComponent } from './automation/rule.component';
import { SelectUserComponent } from './automation/select-user.component';
import { AutomationListComponent } from './automation/automation-list.component';
import { AutomationActionComponent } from './automation/automation-action.component';
import { CpfirmGridComponent } from './cp/cpfirm/cpfirm-grid.component';
import { CpfirmComponent } from './cp/cpfirm/cpfirm.component';
import { CpuserComponent } from './cp/cpuser/cpuser.component';
import { CpuserGridComponent } from './cp/cpuser/cpuser-grid.component';
import { ParkingComponent } from './project/parking/parking.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,FlexLayoutModule,
    ReactiveFormsModule, DemoMaterialModule,
    ChartistModule,
    ChartsModule,
    NgApexchartsModule
  ],
  entryComponents: [ProjectActivityComponent,OfficeActivityComponent,SelectUserComponent,RuleComponent,CpfirmComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  declarations: [UserGridComponent,UserActivityComponent,CompanyComponent,ProjectGridComponent,ProjectActivityComponent,ParkingComponent,
                OfficeGridComponent,OfficeActivityComponent,AdminDashboardComponent,
                SelectUserComponent,RuleComponent,AutomationListComponent,AutomationActionComponent, CpfirmGridComponent, CpfirmComponent, CpuserComponent, CpuserGridComponent]
})

export class AdminModule {

}
