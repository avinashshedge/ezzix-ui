import { Component, OnInit, Inject} from '@angular/core';
import { LeadService } from '../lead.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarketingService } from '../../marketing/marketing.service';

@Component({
    selector: 'sms-editor',
    templateUrl: './sms.component.html'
})
export class SMSComponent implements OnInit {
    selectedProject;
    public leads;templates;templateMessage;parameterList;
    public smsContent : any="";inputParameter;
    constructor(private _service: LeadService,private marketingService:MarketingService,
        public ref: MatDialogRef<SMSComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
        private messageService:NotificationService) {
        }

    ngOnInit() {
        this.leads = this.data.leads;
        this.selectedProject = localStorage.getItem('projectId');
        this.getParameters();
        this.getSMSTemplates();
    }

    getParameters(){
        this._service.getParameters().subscribe(res=>{
            this.parameterList = res;
        })
    }

    getSMSTemplates(){
        this.marketingService.getSMSTemplateList(this.selectedProject).subscribe( res=>{
            this.templates = res;
        });
    }
    onTemplateSelection(){
        this.smsContent = this.templateMessage;
    }

    onParamaterSelection(oField) {
        oField.value= oField.value.substr(0,oField.selectionStart) + this.inputParameter + oField.value.substr(oField.selectionStart,oField.value.length);
    }

    onSendSMS(){

        var data = {
            leads:this.leads,
            smsContent:this.smsContent,
        };

        if(this.smsContent == undefined || this.smsContent == ""){
            this.messageService.warn('Message can not be empty');
            return;
        }

        this._service.sendSMS(data).subscribe(res => {
            this.messageService.success('Message sent successfully');
            this.closeModal();
        },
        error => {
            console.log(error);
        });
    }

    closeModal() {
        this.ref.close();
    }

}
