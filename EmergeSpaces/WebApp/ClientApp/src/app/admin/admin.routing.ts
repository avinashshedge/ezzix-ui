import { Routes } from '@angular/router';
import { UserGridComponent } from './user/user-grid/user-grid-component';
import { UserActivityComponent } from './user/user-activity/user-activity-component';
import { CompanyComponent } from './company/company.component';
import { ProjectGridComponent } from './project/project-grid/project-grid-component';
import { OfficeGridComponent } from './office/office-grid/office-grid-component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AutomationListComponent } from './automation/automation-list.component';
import { AutomationActionComponent } from './automation/automation-action.component';
import { CpfirmGridComponent } from './cp/cpfirm/cpfirm-grid.component';
import { CpuserGridComponent } from './cp/cpuser/cpuser-grid.component';

export const AdminRoutes: Routes = [
 //user
 {
  path: '',
  component: AdminDashboardComponent,
  data: {
      title: 'Dashboard',
  }
},
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,
  data: {
      title: 'Dashboard',
  }
},
 {
    path: 'user-list',
    component: UserGridComponent,
    data: {
        title: 'User List',
    }
  },
  {
    path: 'user-list',
    component: UserGridComponent,
    data: {
        title: 'User List',
    }
  },
  {
    path: 'user-add',
    component: UserActivityComponent,
    data: {
        title: 'New User',
    }
  },
  {
    path: 'user-edit/:id',
    component: UserActivityComponent,
    data: {
        title: 'Update User',
    }
  },

  {
    path: 'campany-details',
    component: CompanyComponent,
    data: {
        title: 'Company Details',
    }
  },
  {
    path: 'project-list',
    component: ProjectGridComponent,
    data: {
        title: 'Project List',
    }
  },
  {
    path: 'office-list',
    component: OfficeGridComponent,
    data: {
        title: 'Office List',
    }
  },
  {
    path: 'automation-list',
    component: AutomationListComponent,
    data: {
        title: 'Automations',
    }
  },
  {
    path: 'automation-add',
    component: AutomationActionComponent
  },
  {
    path: 'automation-edit/:id',
    component: AutomationActionComponent
  },
  {
    path: 'cp-list',
    component: CpfirmGridComponent
  },
  {
    path: 'cp-users',
    component: CpuserGridComponent
  }
];


