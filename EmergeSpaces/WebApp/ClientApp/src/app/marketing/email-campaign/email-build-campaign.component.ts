import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, QueryList } from '@angular/core';
import { MarketingService } from '../marketing.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../../NotificationService';
import { UserService } from '../../admin/user/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ModalTemplateComponent } from './modal-template.component';


declare module unlayer {
    function init(object);
    function exportHtml(object);
    function loadDesign(object);
}

@Component({
  selector: 'email-build-campaign',
  templateUrl: './email-build-campaign.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EmailBuildCampaignComponent implements OnInit {
    data = [];   page = 0;   size = 10;  public templates:any = [];

    public leads;public name;public category;public from;
    public leadListId;public subject;public scheduledOn;
    public selectedTemplate;public selectedemailId;
    public templateHtml;public templateJson;
    public testEmailId;
    minDate: Date = new Date();
    public users:any;
    isEditorLoaded = false;
    enableSendButton = false;
    scheduleToTime;
    campaignId;
    recipientCount = 0;

    templateFormGroup: FormGroup;
    composeFormGroup: FormGroup;
    selectedProject;
    constructor(private marketingService:MarketingService,private router: Router,
                private adminService:UserService,private fb: FormBuilder,
                public dialog: MatDialog,private messageService:NotificationService){

        this.templateFormGroup = this.fb.group({
            campaignName: ['', Validators.required],
            category: ['']
          });
          this.composeFormGroup = this.fb.group({
            from: ['',Validators.required],
            leadListId:['',Validators.required],
            subject:['',Validators.required],
          });
    }

    ngOnInit(): void {
      this.selectedProject = localStorage.getItem('projectId');
        this.getEmailTemplateList();
        this.getLeadList();
        this.getUsers();
    }

    getUsers(){
        this.adminService.getAllUsers().subscribe(
            res => {
                this.users = res;
            }
        )
    }
    ngAfterViewChecked(){
        if(this.isEditorLoaded)
        {
            this.loadEditor();
            this.isEditorLoaded = false;
        }
    }

    protected loadEditor() {
        document.querySelector('div#editor').innerHTML = "";
        unlayer.init({
          id: "editor",
          displayMode: 'email',
        });
        if(this.templateJson != undefined){
            unlayer.loadDesign(this.templateJson);
        }

    }

    onNextStep(stepper: MatStepper){
        this.isEditorLoaded = true;
        stepper.next();
    }

    onComposeNextStep(stepper: MatStepper){
        var self= this;
        unlayer.exportHtml(function (res) {
            self.templateJson = res.design;
            self.templateHtml = res.html;
        });

        setTimeout(function() {
          stepper.next();
        }.bind(this), 500);
    }

    onDesktopPreview(value){
        let printContents, popupWin;
        printContents = value;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=720px,width=1280px');
        popupWin.document.open();
        popupWin.document.write(`${printContents}`
        );
        popupWin.document.close();
    }

    getData(obj) {
        let index=0,
            startingIndex=obj.pageIndex * obj.pageSize,
            endingIndex=startingIndex + obj.pageSize;

        this.data = this.templates.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
    }


    getEmailTemplateList(){
        this.marketingService.getEmailTemplateList(this.selectedProject).subscribe(res => {
          this.templates = res;
          this.getData({pageIndex: this.page, pageSize: this.size});
        },
        err =>{
            console.log(err);
        });
    }

    getLeadList(){
        this.marketingService.getLeadList(this.selectedProject).subscribe(res=>{
            this.leads = res;
        },
        err =>{
            console.log(err);
        });
    }
    onLeadListChange(){
        var leadId = this.composeFormGroup.value['leadListId'];
        this.getLeadListById(leadId);
    }

    getLeadListById(leadId){

        this.marketingService.getLeadListDetails(leadId).subscribe( res => {
           var response :any = res;
            this.recipientCount = response.recipientCount;
        })
    }

    selectTemplate(row: any) {
        this.selectedTemplate = row;
        this.selectedemailId = row.id;
        this.templateJson = JSON.parse(row.templateJson);
        this.templateHtml = row.templateHtml;
        event.preventDefault();
    }

    onCancel(){
        this.router.navigate(['marketing/email-dashboard']);
    }

    onSaveTemplate(){

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;


        const ref = this.dialog.open(ModalTemplateComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
            var self= this;
                unlayer.exportHtml(function (res) {
                    self.templateJson = res.design;
                    self.templateHtml = res.html;
                });

                setTimeout(function() {
                   this.saveEmailTemplate(result);
                }.bind(this), 500);
        });
    }

    saveEmailTemplate(templateName){
        var self = this;
        let request ={
            templateName:templateName,
            projectId:this.selectedProject,
            templateHtml:this.templateHtml,
            templateJson: JSON.stringify(this.templateJson)
        };
        this.marketingService.saveEmailTemplate(request).subscribe(res=>{
            self.messageService.success('Email Template created');
        },
        err =>{
            console.log(err);
        })
    }

    onDraft(){

       if(!this.composeFormGroup.valid){
        return;
       }
        var data = {
            id: this.campaignId,
            projectId:this.selectedProject,
            campaignName: this.templateFormGroup.value['campaignName'],
            category: this.templateFormGroup.value['category'],
            from: this.composeFormGroup.value['from'],
            leadListId: this.composeFormGroup.value['leadListId'],
            subject: this.composeFormGroup.value['subject'],
            templateHtml:this.templateHtml,
            templateJson: JSON.stringify(this.templateJson),
            scheduledOn:this.scheduledOn,
            status: "Draft"
        };

        this.marketingService.saveEmailCampaign(data).subscribe( res =>{
            this.campaignId = res;
            this.messageService.success('Email Campaign saved');
        },
        err =>{
            console.log(err);
            this.messageService.warn('Error occured while creating campaign');
        });
    }

    sendTestMail(){
        var data = {
            from: this.from,
            to: this.testEmailId,
            subject:this.subject,
            emailContent:this.templateHtml
        };

        this.marketingService.sendTestEmail(data).subscribe( res =>{
            this.messageService.success('Email Send');
            this.enableSendButton = true;
        },
        err =>{
            console.log(err);
            this.messageService.warn('Error occured while creating campaign');
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

    onSend(){

      if(this.scheduledOn){
        this.scheduledOn = this.setDate(this.scheduledOn,this.scheduleToTime);
      }
        var data = {
            id: this.campaignId,
            projectId:this.selectedProject,
            campaignName: this.templateFormGroup.value['campaignName'],
            category: this.templateFormGroup.value['category'],
            from: this.composeFormGroup.value['from'],
            leadListId: this.composeFormGroup.value['leadListId'],
            subject: this.composeFormGroup.value['subject'],
            templateHtml:this.templateHtml,
            templateJson: JSON.stringify(this.templateJson),
            scheduledOn:this.scheduledOn,
            status: "Send"
        };

        this.marketingService.saveEmailCampaign(data).subscribe( res =>{
          this.runEmailCampaign(res);
            this.messageService.success('Email Campaign created');
           this.router.navigate(['marketing/email-campaigns']);

        },
        err =>{
            console.log(err);
            this.messageService.warn('Error occured while creating campaign');
        });
    }

    runEmailCampaign(campaignId){
      this.marketingService.runEmailCampaign(campaignId).subscribe(res =>{

      });
    }

}
