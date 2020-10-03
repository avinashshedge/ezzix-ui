import { Component, Output, EventEmitter } from "@angular/core";
import { fabAnimations } from './fab.animation';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { QuickLeadComponent } from "../lead/quick-lead/quick-lead.component";
import { ProjectActivityComponent } from "../admin/project/project-activity/project-activity-component";
import { DetailLeadComponent } from "../lead/detail-lead/detail-lead.component";
import { SharedService } from "./shared.service";

@Component({
    selector: 'app-fab',
    templateUrl: './fab.component.html',
    styleUrls: ['./fab.component.scss'],
    animations:fabAnimations
  })
  export class FabComponent {
  
    fabButtons = [
      {
        icon: 'fa fa-user-plus',
        tooltip:'Detail Lead',
        index:'2'
      },
      {
        icon: 'fa fa-user',
        tooltip:'Quick Lead',
        index:'1'
      }
    ];
    buttons = [];
    fabTogglerState = 'inactive';
  
    constructor(private dialog:MatDialog,private sharedService:SharedService){

    } 
  
    showItems() {
      this.fabTogglerState = 'active';
      this.buttons = this.fabButtons;
    }
  
    hideItems() {
      this.fabTogglerState = 'inactive';
      this.buttons = [];
    }
  
    onToggleFab() {
      this.buttons.length ? this.hideItems() : this.showItems();
    }

    onFabItemClick(index){
        if(index == '1'){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.width = '50%';
          dialogConfig.autoFocus = true;
          const ref = this.dialog.open(QuickLeadComponent,dialogConfig);
          ref.afterClosed().subscribe(result => { 
            this.sharedService.sendClickEvent();       
          });
      }
      else if(index == '2'){
        const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.width = '50%';
          dialogConfig.autoFocus = true;
          const ref = this.dialog.open(DetailLeadComponent,dialogConfig);
          ref.afterClosed().subscribe(result => {       
            this.sharedService.sendClickEvent(); 
          });
      }
    }
  }