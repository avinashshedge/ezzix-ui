
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  OnInit
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { AppHeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { AppBreadcrumbComponent } from './breadcrumb/breadcrumb.component';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SharedProjectService } from './service/shared-project.service';
import { ProjectService } from '../../admin/project/project.service';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide: boolean;
  url: string;
  sidebarOpened;
  status = false;

  public isLoggedIn =false;
  public role;
  public username;
  public messages:any;

  public showSearch = false;

  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;

  clickEvent() {
    this.status = !this.status;
  }

  selectedProject;projects;

  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private sharedService:SharedProjectService,
    private projectService:ProjectService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.role = localStorage.getItem('role').replace(/["']/g, "");
    this.username = localStorage.getItem('username').replace(/["']/g, "");
    if (localStorage.getItem('token') == "" || localStorage.getItem('token') == null) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
      }

  }


  ngOnInit(): void {
    this.getAllProject();
  }

  getAllProject(){
    this.projectService.getAllProject().subscribe(res => {
        this.projects = res;
        this.selectedProject = this.projects.map(i => i.id)[0];
        this.onProjectChange();
    });
  }
  onProjectChange(){
    this.sharedService.updatedProjectSelection(this.selectedProject);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  // Mini sidebar
}
