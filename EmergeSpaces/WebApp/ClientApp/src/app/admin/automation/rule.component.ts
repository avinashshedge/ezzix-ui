import { OnInit, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LeadService } from "../../lead/lead.service";
import { NotificationService } from "../../NotificationService";
import { MarketingService } from "../../marketing/marketing.service";
import { UserService } from "../user/user.service";

@Component({
    selector: 'rule',
    templateUrl: './rule.component.html'
})

export class RuleComponent implements OnInit {
    allActivityReasons:any;activityReason:any;activityReasons;
    value:any;criteria:any;
    rules:any=[];activityTypeList:any =[];
    projectList:any=[];leadSourceList:any=[];
    ruleDescription ='';
    projectId;trigger;
    emailTemplates;emailTemplate;
    smsTemplates;smsTemplate;
    userList:any = []; selectedUsers:any = [];

    constructor(public ref: MatDialogRef<RuleComponent>,private marketingService:MarketingService,
        private leadService: LeadService,public messageService :NotificationService,private userService:UserService,
        @Inject(MAT_DIALOG_DATA) public data: any){


    }

    ngOnInit(): void {
        this.trigger = this.data.trigger;
        this.projectId = this.data.projectId;
        if(this.trigger == 'on-lead'){
            this.criteria = "Activity Type";
            this.getAllActivityReasons();
        }
        if(this.trigger == 'distribute-leads'){
            this.criteria = "Lead Source";
            this.getUserList();
        }
        this.onCriteriaChange();
        this.getEmailTemplates();
        this.getSMSTemplates();
    }

    getUserList(){
        this.userService.getAllUsers().subscribe(res =>{
            this.userList = res;
        });
    }
    getEmailTemplates(){
        this.marketingService.getEmailTemplatesByProject(this.projectId).subscribe(res => {
          this.emailTemplates = res;
        });
      }

    getSMSTemplates(){
        this.marketingService.getSMSTemplateList(this.projectId).subscribe(res => {
          this.smsTemplates = res;
        });
      }

    getAllActivityReasons(){
        this.leadService.getActivityReasons().subscribe(res => {
          this.allActivityReasons = res;
        },
        error => {
          console.log(error);
        });
    }

    onActivityTypeChange(){
        this.activityReasons = [];
        this.activityReason = "";
        var activityId =  this.activityTypeList.filter(i => i.activityName == this.value)[0].id;
        this.activityReasons = this.allActivityReasons.filter(i => i.activityId == activityId);
    }

    onCriteriaChange(){
        if(this.criteria == "Lead Source"){
            this.getLeadSources();
        }
        else if(this.criteria == "Activity Type"){
            this.getActivityTypes();
        }
    }

    getActivityTypes(){
        this.leadService.getActivityTypes(false).subscribe(res => {
          this.activityTypeList = res;
          var activity = {
            id:1,
            activityName : "Fresh Lead",
          };

          this.activityTypeList.push(activity);
        },
        error => {
          console.log(error);
        });
    }

    getLeadSources(){
        this.leadService.getLeadSources().subscribe(res => {
            this.leadSourceList = res;
        },
        error => {
            console.log(error);
        });
    }

    onClose(){
        this.ref.close();
    }

    onRemove(item){
        var index = this.rules.indexOf(item);
        this.rules.splice(index, 1);
    }
    onSave(){
        if(this.criteria == '' || this.criteria == undefined){
            this.messageService.warn('Please select criteria');
            return;
        }

        if(this.value == '' || this.value == undefined){
            this.messageService.warn('Please select value');
            return;
        }

        if(this.criteria == "Activity Type" && (this.activityReason == '' || this.activityReason == undefined)){
            this.messageService.warn('Please select activity reason');
            return;
        }

        if(this.emailTemplate == undefined && this.smsTemplate == undefined)
        {
            this.messageService.warn('Please select at least one template');
            return;
        }
        if(this.trigger == "distribute-leads" && (this.selectedUsers.length <=0)){
            this.messageService.warn('Please select users');
            return;
        }


        var formatusers ="";
        if(this.selectedUsers!= null && this.selectedUsers.length > 0)
            formatusers = this.selectedUsers.map((user) => {return user.fullName + ',' + user.emailId }).join('|');

            var rule = {
            criteria:this.criteria,
            value:this.value,
            reason:this.activityReason,
            emailTemplateId:this.emailTemplate?.id,
            emailTemplateName:this.emailTemplate?.templateName,
            smsTemplateId:this.smsTemplate?.id,
            smsTemplateName:this.smsTemplate?.templateName,
            users: formatusers
        };

        this.rules.push(rule);
        this.ref.close(this.rules);
    }
}
