import { Component, OnInit, Inject, Input } from '@angular/core';
import { LeadService } from '../lead.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'activity',
  templateUrl: './activity.component.html'
})

export class ActivityComponent implements OnInit {
  leadId; minDate: Date = new Date();
  clicked = false;
  meridian = true;  activityForm: FormGroup;
  submitted = false;   activityTypes :any;   allActivityReasons:any;   activityReasons:any;
  showDate =false;salesusers:any = [];
  type;

  @Input()
  required: boolean;
  constructor(private _service: LeadService, private messageService: NotificationService,
    private diaglogRef : MatDialogRef<ActivityComponent>,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.activityForm = this.fb.group({
      activityId: [null, Validators.required],
      activityReasonId: [null, Validators.required],
      remark:[null],
      salesUserId:[null],
      scheduleDate:[null],
      scheduleTime:['10:00 am'],
      reminder:[null]
    });
  }

  get f() { return this.activityForm.controls; }

  ngOnInit() {
    this.leadId = this.data.leadId;
    this.type = this.data.type;
    if(this.type == "sales"){
      this.getSaleActivityTypes();
    }
    else{
      this.getPresaleActivityTypes();
      this.getSalesUser();
    }
    this.getAllActivityReasons();
  }

  getSalesUser(){
    this._service.getSaleUsers().subscribe(res=>{
      this.salesusers =res;
    });
  }

  onReasonSelection()
  {
    var activityReasonId = this.activityForm.value["activityReasonId"];
    var selectedActivity = this.activityReasons.filter(i => i.id == activityReasonId);
    this.showDate  = selectedActivity[0].showDate;
    if (this.salesusers.length > 0 && this.showDate) {
      this.required = true;
    }
    else{
      this.required =false;
    }
  }

  getPresaleActivityTypes(){
    this._service.getPresaleActivityTypes(false).subscribe(res => {
      this.activityTypes = res;
    },
    error => {
      console.log(error);
    });
  }

  getSaleActivityTypes(){
    this._service.getSaleActivityTypes(false).subscribe(res => {
      this.activityTypes = res;
    },
    error => {
      console.log(error);
    });
  }


  onClose(){
    this.diaglogRef.close();
  }

  getAllActivityReasons(){
    this._service.getActivityReasons().subscribe(res => {
      this.allActivityReasons = res;
    },
    error => {
      console.log(error);
    });
  }

  onActivityTypeChange(){
    this.activityReasons = [];
    this.activityForm.value["activityReasonId"] = "";
    var activityId = this.activityForm.value["activityId"];
    this.activityReasons = this.allActivityReasons.filter(i => i.activityId == activityId);
  }

  onSubmit() {
    this.clicked = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.activityForm.invalid) {
      this.clicked = false;
      return;
    }
    this.activityForm.value.leadId = this.leadId;

    if(this.activityForm.value.scheduleDate!=null){
      this.activityForm.value.scheduleDate =this.setDate(this.activityForm.value.scheduleDate,this.activityForm.value.scheduleTime);
    }

    this._service.addActivity(this.activityForm.value).subscribe(res => {
        this.messageService.success('Activity added');
        this.clicked = false;
        this.diaglogRef.close(res);
      },
      error => {
        this.clicked = false;
        this.diaglogRef.close();
        console.log(error);
      });
    }

  setDate(d,s){
    var parts = s.match(/(\d+)\:(\d+) (\w+)/),
    hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
    minutes = parseInt(parts[2], 10);

    d.setHours(hours);
    d.setMinutes(minutes);

    return new Date(d).toLocaleString();
  }
}



