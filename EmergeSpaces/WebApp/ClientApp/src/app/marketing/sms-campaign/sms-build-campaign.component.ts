import { OnInit, Component } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../NotificationService";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

 @Component({
    selector: 'app-sms-build-campaign',
    templateUrl: './sms-build-campaign.component.html'
  })

export class SMSBuildComponent implements OnInit {

    public template:any;public name:any;
    public templateList:any;public leads:any;
    public leadlist:any;public scheduledOn:any;
    minDate: Date = new Date();
    public inputParameter = "";public parameterList;
    public types:any;public visibilityList:any;
    public type:any;public visibility:any;
    templateForm:FormGroup;
    selectedProject;

    constructor(private marketingService:MarketingService,private router:Router,
                private messageService:NotificationService, private fb:FormBuilder,
                public ref: MatDialogRef<SMSBuildComponent>){
                    this.initForm();

                       this.types = [
                        { 'key':'promotional','value':'Promotional' },{ 'key':'transactional','value':'Transactional' }
                       ];
                       this.visibilityList = [
                        { 'key':'onlyme','value':'Only Me' },{ 'key':'everyone','value':'Everyone' }
                       ];
    }
    get f() { return this.templateForm.controls; }

    initForm(){
        this.templateForm = this.fb.group({
            name :[null,Validators.required],
            projectId:[null],
            template:[null,Validators.required],
            leadListId: [null,Validators.required],
            inputParameter:[null],
            scheduledOn:[null],
            scheduleToTime:['10:00 am'],
            type:['promotional'],
            visibility:['everyone']
        });
    }

    ngOnInit(): void {
      this.selectedProject = localStorage.getItem('projectId');
        this.getSMSTemplateList();
        this.getParameters();
        this.getLeadList();
    }

    getParameters(){
        this.marketingService.getParameters().subscribe(res=>{
            this.parameterList = res;
        })
    }

    getSMSTemplateList(){
        this.marketingService.getSMSTemplateList(this.selectedProject).subscribe(res=>{
            this.templateList = res;
        },
        err =>{
            console.log(err);
        });
    }

    onParamaterSelection(oField) {
        this.inputParameter = this.templateForm.value['inputParameter'];
        oField.value = oField.value.substr(0,oField.selectionStart) + this.inputParameter + oField.value.substr(oField.selectionStart,oField.value.length);
        this.templateForm.value['description'] = oField.value;
    }

    getLeadList(){
        this.marketingService.getLeadList(this.selectedProject).subscribe(res=>{
            this.leads = res;
        },
        err =>{
            console.log(err);
        });
    }

    onClose(){
        this.ref.close();
    }

    setDate(d,s){
        var parts = s.match(/(\d+)\:(\d+) (\w+)/),
        hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
        minutes = parseInt(parts[2], 10);

        d.setHours(hours);
        d.setMinutes(minutes);

        return new Date(d).toLocaleString();
    }


    onRun(){

      this.templateForm.value.projectId = localStorage.getItem('projectId');

      if(this.templateForm.value.scheduledOn){
        this.templateForm.value.scheduledOn = this.setDate(this.templateForm.value.scheduledOn,
                                                            this.templateForm.value.scheduleToTime);
        }

        this.marketingService.saveSMSCampaign(this.templateForm.value).subscribe(res=>{
            this.messageService.success('Campaign created');
            this.ref.close(res);
        },
        err =>{
            console.log(err);
        })
    }
}
