import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { LeadService } from '../lead.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarketingService } from '../../marketing/marketing.service';
import { NotificationService } from '../../NotificationService';
//import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
//import PlaceHolder from 'ckeditor5-placeholder';

// DecoupledEditor.create(document.querySelector("#editor"), {
//     plugins: [
//         PlaceHolder
//     ],
//     toolbar: [
//         "placeholder",
//     ],
//     placeholderProps: {
//       types: ["Full Name", "Date"],
//     },
//   });

@Component({
    selector: 'email-editor',
    templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {

   // public Editor = DecoupledEditor;

    parameterList;inputParameter;
    public subject;
    public emailContent ="";
    public leads;
    templates;templateHtml;
    editor: any;

    @ViewChild('Editor') editorComponent;
    selectedProject;
    constructor(private _service: LeadService,public marketingService:MarketingService,
        public ref: MatDialogRef<EmailComponent>,@Inject(MAT_DIALOG_DATA) public data: any
        ,private messageService:NotificationService) {
        }

    ngOnInit() {
        this.leads = this.data.leads;
        this.selectedProject = localStorage.getItem('projectId');
        this.getParameters();
        this.getEmailTemplates();
    }

    getParameters(){
        this._service.getParameters().subscribe(res=>{
            this.parameterList = res;
        })
    }

    getEmailTemplates(){

        this.marketingService.getEmailTemplateList(this.selectedProject).subscribe(res =>{
            this.templates = res;
        })
    }

    onTemplateSelection(){
        this.emailContent = this.templateHtml;
    }

    onParamaterSelection() {
        var quill = this.editorComponent.quillEditor;
        const selection = quill.getSelection(true); // get position of cursor (index of selection)
        quill.insertText(selection.index, this.inputParameter);
    }



    onSendEmail(){

        if(this.subject == undefined || this.subject == ''){
            this.messageService.warn('Please enter subject');
            return;
        }

        if(this.emailContent == undefined || this.emailContent == ''){
            this.messageService.warn('Please enter Email content');
            return;
        }

        var request  = {
            subject:this.subject,
            emailContent:this.emailContent,
            leads:this.leads
        }

        this._service.sendEmail(request).subscribe( res=>{
            this.messageService.success('Email sent successfully');
            this.closeModal();
        })
    }

    closeModal() {
        this.ref.close();
    }

}
