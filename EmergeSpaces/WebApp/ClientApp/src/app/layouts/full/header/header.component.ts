import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../../../authentication/reset/resetpassword.component';
import { NotificatioDataService } from '../service/notification-data.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})

export class AppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};
  notifications:any = [];
  newMessageAvailable = false;
  userName;initials;

  constructor(private router:Router,private notificationService: NotificatioDataService,
    private headerService:HeaderService,
    private dialog:MatDialog){

      this.userName = localStorage.getItem('username').replace(/["']/g, "");
      var initName = this.userName.match(/\b\w/g) || [];
      this.initials = ((initName.shift() || '') + (initName.pop() || '')).toUpperCase();


      this.getNotications();
      this.notificationService.data.subscribe(message => {
        if(message){
          this.newMessageAvailable = true;
          this.notifications.push(message);
        }
      });
    }

    onLogout(){
      localStorage.removeItem('token');
      this.router.navigate(['/authentication/login']);
    }

    onNotificationClick(){
      this.newMessageAvailable = false;
    }

  onReset(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(ResetPasswordComponent,dialogConfig);
  }

  getNotications(){
    this.headerService.getNotification().subscribe(res=>{
      this.notifications = res;
    });
  }
}
