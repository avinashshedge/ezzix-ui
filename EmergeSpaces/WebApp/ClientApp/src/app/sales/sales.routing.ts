import { Routes } from '@angular/router';
import { SalesDashboardComponent } from './dashboard/sales-dashboard.component';
import { SalesLeadGridComponent } from './leads/sales-lead-grid.component';
import { SalesTaskDashboardComponent } from './task/sales-task-dashboard.component';
import { TimelineComponent } from '../lead/timeline/timeline.component';

export const SaleRoutes: Routes = [
    {
        path: '',
        component: SalesDashboardComponent,
        data: {
            title: 'Dashboard',
        }
    },
    {
        path: 'dashboard',
        component: SalesDashboardComponent,
        data: {
            title: 'Dashboard',
        }
    },
    {
        path: 'lead-list',
        component: SalesLeadGridComponent,
        data: {
            title: 'Manage Leads',
        }
    },
    {

      path: 'task-board',
      component: SalesTaskDashboardComponent,
      data: {
          title: 'Task Board',
      }
    },
    {
      path: 'timeline/:id/:type',
      component: TimelineComponent,
      data: {
          title: 'Lead Details',
      }
  },
];
