import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ActivityComponent } from './activity.component';
import { MatOption } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { data } from 'jquery';

@Component({
  selector: 'activity_details',
  templateUrl: './activity_details.component.html',
  styleUrls: ['./activity_details.component.scss']
})

export class ActivityDetailsComponent implements OnInit {
  activities;   leadId;  activityTypes; filterActivityTypes;selectedFilter;
  formGroup: FormGroup;
  type;
  constructor(private _service: LeadService,private activatedRoute: ActivatedRoute,private dialog:MatDialog)
  {
    this.formGroup = new FormGroup({
      selectedFilter: new FormControl([])
    })
    this.activities = [];
    this.activatedRoute.params.subscribe(params => {
      this.leadId = params['id'];
      this.type = params['type'];
    });

  }

  ngOnInit() {
    if(this.type == "sales"){
      this.getSalesActivities();
    }else{
      this.getActivities();
    }
    this.getFilterActivityTypes();
  }

  getFilterActivityTypes(){
    this._service.getActivityTypes(true).subscribe(res => {
      this.filterActivityTypes = res;
    },
    error => {
      console.log(error);
    });
  }


  showAcitivyModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
          leadId:this.leadId,
          type:this.type
    };

    const ref = this.dialog.open(ActivityComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      if(result != null){
        if(this.type == "sales"){
          this.getSalesActivities();
        }else{
          this.getActivities();
        }
        this.runActivityAutomation(result);
      }
    });

  }

  getActivityUrl(activity){
    return activity.imageUrl == null ? 'fa fa-bomb' : activity.imageUrl;
  }
  runActivityAutomation(result){
    this._service.runActivityAutomation(result).subscribe(res => {
        this.getActivities();
      },
      error => {
        this.getActivities();
        console.log(error);
      });
  }


  onTypeChange(){
    var filter = this.formGroup.value.selectedFilter.join();
    this._service.getActivitiesByLead(this.leadId,filter).subscribe(
      res => {
        this.activities = res;
      }
    );
  }

  getActivities() {
    this._service.getActivitiesByLead(this.leadId,"all").subscribe(
      res => {
        this.activities = res;
      }
    );
  }

  getSalesActivities() {
    this._service.getSalesActivitiesByLead(this.leadId,"all").subscribe(
      res => {
        this.activities = res;
      }
    );
  }

  monthYears() : Array<string> {
    return Object.keys(this.activities);
  }
  onActivityTypeChange(){

  }
}
