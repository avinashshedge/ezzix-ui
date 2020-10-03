import { OnInit, Component } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { ProjectService } from "../../admin/project/project.service";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../NotificationService";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'page-action',
    templateUrl: './page-action.component.html'
})

export class PageActionComponent implements OnInit {
    name:any;url:any;type:any;
    projectList:any = [];projectId:any;
    pageForm:FormGroup;
    constructor(private projectService:ProjectService, private fb:FormBuilder,
        private marketingService:MarketingService,
        public ref: MatDialogRef<PageActionComponent>,private messageService:NotificationService){

    }
    ngOnInit(): void {
        this.pageForm = this.fb.group({
            type: [null, Validators.required],
            projectId:[null],
            name: [null,Validators.required],
            url:[null,Validators.required],
            fieldType:['id'],
            nameField:[null,Validators.required],
            mobileField:[null,Validators.required],
            emailField:[null,Validators.required],
            descriptionField:[null,Validators.required]
        });

    }

    get f() { return this.pageForm.controls; }


      onClose(){
          this.ref.close();
      }
      onSave(){
        this.pageForm.value.projectId = localStorage.getItem('projectId');
        this.marketingService.saveLandingPage(this.pageForm.value).subscribe(res => {
            this.messageService.success('Landing page created');
            this.ref.close();
        },
        err =>{
            console.log(err);
        })
    }

}
