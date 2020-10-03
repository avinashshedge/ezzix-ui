import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface BadgeItem {
    type: string;
    value: string;
}
export interface Saperator {
    name: string;
    type?: string;
}
export interface SubChildren {
    state: string;
    name: string;
    type?: string;
}
export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
    child?: SubChildren[];
}

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    saperator?: Saperator[];
    children?: ChildrenItems[];
}

const MENUITEMS = [
    {
        state: '',
        name: 'Admin',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        parentstate:'admin',
        state: 'admin-dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'campany-details',
        name: 'Company',
        icon: 'business',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'user-list',
        name: 'Users',
        icon: 'people',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'project-list',
        name: 'Projects',
        icon: 'business',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'office-list',
        name: 'Offices',
        icon: 'business',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'automation-list',
        name: 'Automation',
        icon: 'settings',
        type:'link'
    },
    {
        parentstate:'admin',
        state: 'admin',
        name: 'Channel Partner',
        type: 'sub',
        icon: 'sync',
        children: [
            { state: 'cp-list', name: 'CP Firms', type: 'link' },
            { state: 'cp-users', name: 'CP Users', type: 'link' }
        ]
    },
    {
        state: '',
        name: 'Pre sale',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        parentstate:'lead',
        state: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
        type:'link'
    },
    {
        parentstate:'lead',
        state: 'task-board',
        name: 'Task Board',
        icon: 'dashboard',
        type:'link'
    },
    {
        parentstate:'lead',
        state: 'lead-list',
        name: 'Manage Leads',
        icon: 'people',
        type:'link'
    },
    {
      state: '',
      name: 'CP',
      type: 'saperator',
      icon: 'av_timer'
    },
    {
      parentstate:'cp',
      state: 'cp-dashboard',
      name: 'Dashboard',
      icon: 'dashboard',
      type:'link'
    },
    {
      parentstate:'cp',
      state: 'cp-list',
      name: 'Lead List',
      icon: 'list_alt',
      type:'link'
    },
    {
      parentstate:'cp',
      state: 'cp-report',
      name: 'Report',
      icon: 'report',
      type:'link'
    },
    {
      state: '',
      name: 'Reception',
      type: 'saperator',
      icon: 'av_timer'
    },
    {
      parentstate:'reception',
      state: 'reception',
      name: 'Lead Form',
      icon: 'list_alt',
      type:'link'
    },

    {
        state: '',
        name: 'Sales',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        parentstate:'sales',
        state: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
        type:'link'
    },
    {
      parentstate:'sales',
      state: 'task-board',
      name: 'Task Board',
      icon: 'dashboard',
      type:'link'
  },
    {
        parentstate:'sales',
        state: 'lead-list',
        name: 'Manage Leads',
        icon: 'people',
        type:'link'
    },
    {
        state: '',
        name: 'Marketing',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        parentstate:'marketing',
        state: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'lead-source',
        name: 'Lead Source',
        icon: 'settings',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'email-campaigns',
        name: 'Email Campaign',
        icon: 'email',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'sms-campaign',
        name: 'SMS Campaign',
        icon: 'message',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'lead-list',
        name: 'Lead List',
        icon: 'list_alt',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'landing-page',
        name: 'Websites & Landing Pages',
        icon: 'web',
        type:'link'
    },
    {
        parentstate:'marketing',
        state: 'unmanaged-leads',
        name: 'Unmanaged Leads',
        icon: 'people',
        type:'link'
    },
    {
      parentstate:'marketing',
      state: 'library',
      name: 'Library',
      icon: 'photo_library',
      type:'link'
  },
    {
        parentstate:'marketing',
        state: 'marketing',
        name: 'Social Media',
        type: 'sub',
        icon: 'sync',
        children: [
            { state: 'facebook', name: 'Facebook', type: 'link' },
            { state: 'facebook-ads', name: 'Facebook Ads', type: 'link' }
        ]
    },
  {
      state: '',
      name: 'Reports',
      type: 'saperator',
      icon: 'av_timer'
  },
  {
      parentstate:'reports',
      state: 'reports',
      name: 'Reports',
      icon: 'report',
      type:'link'
  }
];
@Injectable()
export class MenuItems {
    selectedRoute = '';
    constructor(private router:Router){

    }
    getMenuitem(): Menu[] {
        this.selectedRoute = this.router.url;
        if(this.selectedRoute == '/calling-dashboard' || this.selectedRoute == '/lead'
        || this.selectedRoute == '/lead/lead-list' || this.selectedRoute == '/lead/dashboard'
        || this.selectedRoute.indexOf('lead/timeline') != -1
        || this.selectedRoute.indexOf('lead/task-board') != -1){
          return MENUITEMS.filter(i => i.parentstate == 'lead');
        }
        if(this.selectedRoute == '/sales' || this.selectedRoute == '/sales/lead-list' || this.selectedRoute == '/sales/dashboard'
        || this.selectedRoute.indexOf('sales/task-board') != -1
        || this.selectedRoute.indexOf('sales/timeline') != -1){
          return MENUITEMS.filter(i => i.parentstate == 'sales');
        }
        else if(this.selectedRoute.indexOf('admin') != -1 || this.selectedRoute == '/'){
         return   MENUITEMS.filter(i => i.parentstate == 'admin');
        }
        else if(this.selectedRoute.indexOf('marketing') != -1){
            return MENUITEMS.filter(i => i.parentstate == 'marketing');
        }
        else if(this.selectedRoute.indexOf('cp') != -1){
          return MENUITEMS.filter(i => i.parentstate == 'cp');
        }
        else if(this.selectedRoute.indexOf('reception') != -1){
          return MENUITEMS.filter(i => i.parentstate == 'reception');
        }
        else if(this.selectedRoute.indexOf('reports') != -1){
          return MENUITEMS.filter(i => i.parentstate == 'reports');
        }

       // return MENUITEMS;
    }
}
