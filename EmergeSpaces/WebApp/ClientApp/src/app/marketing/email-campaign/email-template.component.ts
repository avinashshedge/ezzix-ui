import { OnInit, Component, ViewChild, OnDestroy } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { Router } from "@angular/router";
import { ProjectService } from "../../admin/project/project.service";
import { UserService } from "../../admin/user/user.service";
import { NotificationService } from "../../NotificationService";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { LeadService } from "../../lead/lead.service";

declare module unlayer {
    function init(object);
    function exportHtml(object);
}

@Component({
    selector: 'app-email-template',
    templateUrl: './email-template.component.html'
})

export class EmailTemplateComponent implements OnInit,OnDestroy {

    public users:any;projectId;projectList;
    public templateName;public subject;public userId;
    public templateHtml;
    public templateJson;
    selectedProject;

    constructor(private leadService:LeadService, private marketingService:MarketingService,
        private sharedProjectService: SharedProjectService,private router:Router,private messageService:NotificationService){

    }

    ngOnInit() {
      this.sharedProjectService.data.subscribe(data => {
        if(data && this.router.url == '/marketing/email-template'){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.getUsers();
          }
        });

        this.loadEditor();
      }

    getUsers(){
        this.leadService.getAllExecutiveUsers(this.selectedProject).subscribe(res => {
            this.users = res;
        })
    }
    ngOnDestroy(){
        // unlayerScript.
    }
    protected loadEditor() {
        unlayer.init({
          id: 'editor',
          //projectId: 3304,//this.projectId,
         // templateId: this.templateId,
          displayMode: 'email',
        });
    }

    onCancel(){
        this.router.navigate(['marketing/email-campaigns']);
    }
    onSave(){
        var self = this;
        if(this.templateName == '' || this.templateName == null){
            this.messageService.warn('Enter Template name');
            return;
        }
        if(this.subject == '' || this.subject == null){
            this.messageService.warn('Enter Subject');
            return;
        }
        if(this.userId == '' || this.userId == null){
            this.messageService.warn('Select User');
            return;
        }
        this.projectId = this.selectedProject;
        unlayer.exportHtml(function (data) {
            //var json = data.design; // design json
            self.templateJson = data.design;
            self.templateHtml = data.html;
            // Do something with the json and html
        });

        setTimeout(function() {
            self.saveEmailTemplate();
        }.bind(this), 2000);
    }

    saveEmailTemplate(){
        var self = this;
        let request ={
            subject:this.subject,
            userEmailId:this.userId,
            projectId:this.projectId,
            templateName:this.templateName,
            templateHtml:this.templateHtml,
            templateJson: JSON.stringify(this.templateJson)
        };
        this.marketingService.saveEmailTemplate(request).subscribe(res=>{
            self.messageService.success('Email Template created');
            setTimeout(function() {
                this.router.navigate(['marketing/email-campaigns']);
            }.bind(this), 1000);
        },
        err =>{
            console.log(err);
        })
    }


}
