import { OnInit, Component } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../NotificationService";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'app-sms-template',
    templateUrl: './sms-template.component.html'
  })
  export class SMSTemplateComponent implements OnInit {

    public templateName:any;public inputParameter:any;
    public type:any;types:any; projectId;projectList;
    public parameterList:any;public visibility:any; public visibilityList:any;
    public description:any;
    templateForm:FormGroup;

    constructor(private marketingService:MarketingService,private router:Router,private fb:FormBuilder,
                private messageService:NotificationService,
                public ref: MatDialogRef<SMSTemplateComponent>){

                  this.initForm();
    }

get f() { return this.templateForm.controls; }

initForm(){
    this.templateForm = this.fb.group({
        templateName: [null, Validators.required],
        description:[null,Validators.required],
        projectId: [null],
        inputParameter:[null],
        type:['promotional'],
        visibility:['everyone']
    });
  }

    ngOnInit(): void {
        this.types = [
            { 'key':'promotional','value':'Promotional' },{ 'key':'transactional','value':'Transactional' }
           ];
           this.visibilityList = [
            { 'key':'onlyme','value':'Only Me' },{ 'key':'everyone','value':'Everyone' }
           ];

          this.getParameters();
    }

    getParameters(){
        this.marketingService.getParameters().subscribe(res=>{
            this.parameterList = res;
        })
    }

    onParamaterSelection(oField) {
        this.inputParameter = this.templateForm.value['inputParameter'];
        oField.value = oField.value.substr(0,oField.selectionStart) + this.inputParameter + oField.value.substr(oField.selectionStart,oField.value.length);
        this.templateForm.value['description'] = oField.value;
    }

    onCancel(){
        this.router.navigate(['marketing/sms-template']);
    }

    onClose(){
        this.ref.close();
    }

    onSave(){

      this.templateForm.value.projectId= localStorage.getItem('projectId');

      this.marketingService.saveSMSTemplate(this.templateForm.value).subscribe(()=>{
            this.messageService.success('SMS Template created');
            this.ref.close();
        },
        err =>{
            console.log(err);
        });
      }
  }
