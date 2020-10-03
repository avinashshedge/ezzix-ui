import { Routes } from "@angular/router";
import { UserReportComponent } from "./adminreport/userreport.component";
import { LoginReportComponent } from "./adminreport/loginreport.component";
import { EmailUsageReportComponent } from "./adminreport/emailusagereport.component";
import { SmsUsageReportComponent } from "./adminreport/smsusagereport.component";
import { DeletedLeadReportComponent } from "./adminreport/deletedleadreport.component";
import { LeadReportComponent } from "./adminreport/leadreport.component";
import { ReportComponent } from "./adminreport/report.component";
import { PresaleLeadCountReportComponent } from "./presalereport/presaleleadcountreport.component";
import { PresaleLeadSourceReportComponent } from "./presalereport/presaleleadsourcereport.component";

export const ReportRoutes: Routes = [
  {
    path: '',
    component: ReportComponent,
    data: {
        title: 'Reports',
    }
  },
  {
    path: 'reports',
    component: ReportComponent,
    data: {
        title: 'Reports',
    }
  },
  {
    path: 'userreport',
    component: UserReportComponent,
    data: {
        title: 'User Report',
    }
  },
  {
    path: 'loginreport',
    component: LoginReportComponent,
    data: {
        title: 'Login Report',
    }
  },
  {
    path: 'emailusagereport',
    component: EmailUsageReportComponent,
    data: {
        title: 'Email Usage Report',
    }
  },
  {
    path: 'smsusagereport',
    component: SmsUsageReportComponent,
    data: {
        title: 'SMS Usage Report',
    }
  },
  {
    path: 'deletedleadreport',
    component: DeletedLeadReportComponent,
    data: {
        title: 'Deleted Lead Report',
    }
  },
  {
    path: 'leadreport',
    component: LeadReportComponent,
    data: {
        title: 'Lead Report',
    }
  },
  {
    path: 'presaleleadcountreport',
    component: PresaleLeadCountReportComponent,
    data: {
        title: 'Presale Lead Count Report',
    }
  },
  {
    path: 'presaleleadsourcereport',
    component: PresaleLeadSourceReportComponent,
    data: {
        title: 'Presale Lead Source Report',
    }
  }
];
