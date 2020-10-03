import { Routes } from '@angular/router';
import { LeadGridComponent } from './lead-grid/lead-grid.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PresaleDashboardComponent } from './dashboard/presale-dashboard.component';
import { TaskDashboardComponent } from './task/task-dashboard.component';

export const LeadRoutes: Routes = [
    {
        path: '',
        component: PresaleDashboardComponent,
        data: {
            title: 'Dashboard',
        }
    },
    {
        path: 'dashboard',
        component: PresaleDashboardComponent,
        data: {
            title: 'Dashboard',
        }
    },
    {
        path: 'lead-list',
        component: LeadGridComponent,
        data: {
            title: 'Manage Leads',
        }
    },

    {
        path: 'timeline/:id/:type',
        component: TimelineComponent,
        data: {
            title: 'Lead Details',
        }
    },
    {

      path: 'task-board',
      component: TaskDashboardComponent,
      data: {
          title: 'Task Board',
      }
    }
];
