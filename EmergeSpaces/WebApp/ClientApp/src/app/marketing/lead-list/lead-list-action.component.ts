import { OnInit, Component, Inject } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { LeadService } from "../../lead/lead.service";
import { NotificationService } from "../../NotificationService";
import { ProjectService } from "../../admin/project/project.service";
import { UserService } from "../../admin/user/user.service";
import { CompanyService } from "../../admin/company/company.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'lead-list-action',
    templateUrl: './lead-list-action.component.html'
})

export class LeadListActionComponent implements OnInit {
    public leadListForm:FormGroup;
    public leadListId; name; criteria; description;
    public leadListDetails;
    public criteriaList; leadSourceList; budgetRangeList; companyList;stateList;projectList; leadStageList;activityTypeList;
    public ownerList;
    constructor(private leadService: LeadService,public messageService :NotificationService,
        private marketingService:MarketingService,private projectService:ProjectService,
        private adminService:UserService,private companyService:CompanyService,private fb:FormBuilder,
        public ref: MatDialogRef<LeadListActionComponent>,@Inject(MAT_DIALOG_DATA) public data: any){

    }

    ngOnInit(): void {

        this.leadListId = this.data.leadListId;
        this.criteriaList = [
                             { 'key':'lead-source','value':'Lead Source' },
                             { 'key':'activity-type','value':'Activity Type' },
                             { 'key':'lead-stage','value':'Lead Stage' },
                             { 'key':'state','value':'State' },
                             { 'key':'city','value':'City' },
                             { 'key':'user-list','value':'User List' },
                             { 'key':'owner','value':'Owner' },
                             { 'key':'lead-age','value':'Lead Age' },
                             { 'key':'budget','value':'Budget' }
                            ];

        this.initForm();

        if(this.leadListId > 0){

        }
    }



    get f() { return this.leadListForm.controls; }

    onCriteriaChange(){
        this.leadListForm.controls.description.setValue('');
    }

    initForm(){
        this.leadListForm = this.fb.group({
            listName: [null, Validators.required],
            projectId:[null],
            description: [null],
            criteria: [null]
        });

        this.getBudgetRange();
        this.getLeadSources();
        this.getLeadStage();
        this.getActivityTypes();
        this.getStatesByCountry();
        this.getAllUsers();
    }

    getAllUsers() {
        this.adminService.getAllUsers().subscribe(
          res => {
            this.ownerList = res;
          }
        );
    }

    getActivityTypes(){
        this.leadService.getPresaleActivityTypes(false).subscribe(res => {
          this.activityTypeList = res;
        },
        error => {
          console.log(error);
        });
    }

    getBudgetRange(){
        this.leadService.getBudgetRange().subscribe(res => {
          this.budgetRangeList = res;
        },
        error => {
            console.log(error);
        });
    }
    getLeadStage(){
        this.leadService.getLeadStages().subscribe(res => {
          this.leadStageList = res;
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
    getStatesByCountry() {
        this.adminService.getStatesOfCountry(101).subscribe(res => {
            this.stateList = res;
        },
        error => {
            console.log(error);
        });
    }

    getLeadListDetails(){
        this.marketingService.getLeadListDetails(this.leadListId).subscribe(
            res=>{
                this.leadListDetails = res;
            },
            err =>{

            });
    }
    onClose(){
        this.ref.close();
    }

    onSave(){

        this.leadListForm.value.projectId = localStorage.getItem('projectId');
        this.leadListForm.value.description = this.leadListForm.value.description.join();
        this.marketingService.saveLeadDetails(this.leadListForm.value).subscribe(res=>{
            this.messageService.success('Lead List created');
            this.ref.close();
        },
        err =>{
            console.log(err);
        })

    }
}
