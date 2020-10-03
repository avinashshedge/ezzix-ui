import { OnInit, Component } from "@angular/core";
import { RuleComponent } from "./rule.component";
import { SelectUserComponent } from "./select-user.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../project/project.service";
import { NotificationService } from "../../NotificationService";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AutomationService } from "./automation.service";
import { MarketingService } from "../../marketing/marketing.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'automation-action',
    templateUrl: './automation-action.component.html'
})
export class AutomationActionComponent implements OnInit {
    id;
    rules:any = []; triggers = []; emailTemplates:any =[]; smsTemplates:any =[];
    showSMSTemplates =false;showEmailTemplates =false;
    trigger = "on-lead"; email_action:any;
    sms_action;emailTemplate;smsTemplate;name;projectId;
    selectedUsers:any = [];projectList:any = [];
    eventType;scheduledTime = "09:00";scheduledDate="same-day";numberOfDays="1";

    displayedColumns: string[] = ['criteria', 'value', 'reason','users', 'emailTemplateName','smsTemplateName','action'];
    dataSource = new MatTableDataSource<Element>();
    
    constructor(private messageService:NotificationService, private dialogService:MatDialog,
      private service:AutomationService,private router: Router,private activatedRoute: ActivatedRoute,
      private marketingService:MarketingService,private projectService:ProjectService){

        this.activatedRoute.params.subscribe(params => this.id = params['id']);
        if(this.id > 0){
          this.setAutomation();
        }
        this.triggers = [{ 'value': 'on-lead', 'label': 'On Lead' }, { 'value': 'specific-date', 'label': 'On Specific Date' },{ 'value': 'distribute-leads', 'label': 'Distribute Leads' }];
      }

    ngOnInit(): void {
       this.getProjects(); 
    }

    setAutomation(){
      this.service.getAutomation(this.id).subscribe(res => {
        let response :any = res;
          this.name = response.name;
          this.projectId = response.projectId;
          this.trigger = response.trigger;
          if(response.rules != null && response.rules.length > 0){
            this.rules = response.rules;
            this.dataSource = new MatTableDataSource<any>(this.rules);
          }
      });

    }
    
    getProjects() {
      this.projectService.getAllProject().subscribe(res  => {
          this.projectList = res;      
      },
      error => {
          console.log(error);
      });
    }
  
    onRuleModal(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '40%';
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        trigger:this.trigger,
        projectId : this.projectId
      }

      const ref = this.dialogService.open(RuleComponent,dialogConfig); 

      ref.afterClosed().subscribe(data => {
        if(data != undefined){
          data.forEach(element => {
            this.rules.push(element);  
            this.dataSource = new MatTableDataSource<any>(this.rules);
          });              
        }
      });
    }

    onRemove(item){    
      this.dataSource.data.splice(item, 1);
      this.dataSource._updateChangeSubscription();
    }

    onSave(){

      if(this.name == '' || this.name == undefined){
        this.messageService.warn('Please enter Name');            
        return false;
      }
      
      
      if(this.projectId == '' || this.projectId == undefined){
        this.messageService.warn('Please select Project');            
        return false;
      }

      if(this.trigger == '' || this.trigger == undefined){
        this.messageService.warn('Please select Trigger type');            
        return false;
      }
     
      if(this.rules.length == 0){
        this.messageService.warn('Please select at least one rule');            
        return false;
      }
      
      var data ={
        id:this.id,
        name:this.name,
        projectId:this.projectId,
        trigger:this.trigger,
        rules:this.rules,
      }

      if(this.id > 0){
        this.service.updateWorkFlow(data).subscribe(res =>{
          this.messageService.success('Workflow Updated Successfully');
          this.router.navigate(['admin/automation-list']);
        });
      }else{
        this.service.saveWorkFlow(data).subscribe(res =>{
          this.messageService.success('Workflow Created Successfully');
          this.router.navigate(['admin/automation-list']);
        });
      }
    }

    onCancel(){
      this.router.navigate(['admin/automation-list']);
    }

    onUserModal(){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '40%';
      dialogConfig.autoFocus = true;

      const ref = this.dialogService.open(SelectUserComponent,dialogConfig); 

      ref.afterClosed().subscribe(data => {
        if(data != undefined){
          data.forEach(element => {
            var item = {
              userId: element.id,
              fullName:element.fullName
            };
            this.selectedUsers.push(item);  
          });              
        }
      });
    }

    onRemoveUser(item){        
      var index = this.rules.indexOf(item);
      this.selectedUsers.splice(index, 1); 
    }

}