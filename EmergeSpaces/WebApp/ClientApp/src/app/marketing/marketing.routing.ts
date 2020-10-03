import { Routes } from '@angular/router';
import { EmailCampaignsComponent } from './email-campaign/email-campaigns.component';
import { EmailTemplateListComponent } from './email-campaign/email-template-list.component';
import { EmailBuildCampaignComponent } from './email-campaign/email-build-campaign.component';
import { EmailTemplateComponent } from './email-campaign/email-template.component';
import { SMSDashboardComponent } from './sms-campaign/sms-dashboard.component';
import { SMSCampaignComponent } from './sms-campaign/sms-campaign.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { PageListComponent } from './landing-page/page-list.component';
import { UnmanagedLeadsComponent } from './unmanaged-leads/unmanaged-leads.component';
import { FacebookComponent } from './digital/facebook/facebook.component';
import { FacebookAdsComponent } from './digital/facebook/facebook-ads.component';
import { LeadSourceListComponent } from './lead-source/lead-source-list.component';
import { MarketingDashboardComponent } from './dashboard/marketing-dashboard.component';
import { PageDetailComponent } from './landing-page/page-detail.component';
import { SMSCampaignDetailComponent } from './sms-campaign/sms-campaign-detail.component';
import { EmailCampaignDetailComponent } from './email-campaign/email-campaign-detail.component';
import { LibraryComponent } from './library/library.component';

export const MarketingRoutes: Routes = [

    // {
    //     path: '',
    //     component: MarketingDashboardComponent
    // },
    {
        path:'',
        component:MarketingDashboardComponent,
        data: {
            title: 'Dashboard',
        }
    },
    {
      path:'dashboard',
      component:MarketingDashboardComponent,
      data: {
          title: 'Dashboard',
      }
    },
    {
        path:'lead-source',
        component:LeadSourceListComponent,
        data: {
            title: 'Lead Source',
        }
    },
    {
        path:'email-campaigns',
        component:EmailCampaignsComponent,
        data: {
            title: 'Email Campaigns',
        }
    },
    {
        path: 'email-templates',
        component: EmailTemplateListComponent,
        data: {
            title: 'Email Templates',
        }
    },
    {
        path: 'email-build-campaign',
        component: EmailBuildCampaignComponent,
        data: {
            title: 'Build your Campaign',
        }
    },
    {
      path:'email-campaign-detail/:id',
      component:EmailCampaignDetailComponent,
      data:{
        title:'Email Campaign Detail'
      }
    },
    {
        path: 'email-template',
        component: EmailTemplateComponent,
        data: {
            title: 'Create Template',
        }
    },
    {
        path: 'sms-campaign',
        component: SMSDashboardComponent,
        data: {
            title: 'SMS Campaigns',
        }
    },
    {
        path: 'sms-template',
        component: SMSCampaignComponent,
        data: {
            title: 'SMS Templates',
        }
    },
    {
      path:'sms-campaign-detail/:id',
      component:SMSCampaignDetailComponent,
      data:{
        title:'SMS Campaign Detail'
      }
    },
    {
        path: 'lead-list',
        component: LeadListComponent,
        data: {
            title: 'Lead List',
        }
    },
    {
        path: 'landing-page',
        component: PageListComponent,
        data: {
            title: 'Websites & Landing Pages',
        }
    },
    {
      path: 'page-detail/:id',
      component: PageDetailComponent,
      data: {
          title: 'Page Details',
      }
    },
    {
        path: 'unmanaged-leads',
        component: UnmanagedLeadsComponent,
        data: {
            title: 'Unmanaged Leads',
        }
    },
    {
        path:'facebook',
        component:FacebookComponent,
        data: {
            title: 'Facebook',
        }
    },
    {
        path:'facebook-ads',
        component:FacebookAdsComponent,
        data: {
            title: 'Facebook Ads',
        }
    },
    {
      path:'library',
      component:LibraryComponent,
      data: {
          title: 'library',
      }
  }

];
