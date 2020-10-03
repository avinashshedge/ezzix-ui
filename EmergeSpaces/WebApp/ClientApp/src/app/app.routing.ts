import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './guards/auth.guard';

export const AppRoutes: Routes = [
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: '',
                redirectTo: '/authentication/login',
                pathMatch: 'full',
            },{
                path: 'authentication',
                loadChildren:
                    () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
            }
        ]
    },
    {
        path: '',
        canActivate:[AuthGuard],
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/admin',
                pathMatch: 'full'
            },
            {
                path: 'admin',
                data: { roles: ['Admin'] }   ,
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'lead',
                data: { roles: ['Admin', 'Pre Sale Manager', 'Pre Sale Executive'] },
                loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule)
            },
            {
                path: 'sales',
                data: { roles: ['Admin', 'Sales Executive', 'Sales Manager'] },
                loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule)
            },
            {
                path: 'marketing',
                loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule),
                data: { roles: ['Admin','Marketing Manager', 'Marketing Executive', 'View Only'] }
            },
            {
              path: 'cp',
              loadChildren: () => import('./cp/cp.module').then(m => m.CpModule),
              data: { roles: ['Admin','CP User'] }
            },
            {
              path: 'reception',
              loadChildren: () => import('./reception/reception.module').then(m => m.ReceptionModule),
              data: { roles: ['Admin','Receptionist'] }
            },
            {
              path: 'reports',
              loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
              data: { roles: ['Admin','Presale Manager','Sale Manager','Marketing Manager'] }
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'authentication/404'

    }

];
