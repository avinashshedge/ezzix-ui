import { OnInit, Component } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../NotificationService";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'lead-sources',
    templateUrl: './lead-source-action.component.html'
})

export class LeadSourceActionComponent implements OnInit {
    subsourceForm:FormGroup;
    leadsources;
    constructor(private marketingService:MarketingService,public ref: MatDialogRef<LeadSourceActionComponent>,
        private messageService:NotificationService,private fb:FormBuilder){
    }

    ngOnInit(): void {
        this.subsourceForm = this.fb.group({
            name: [null, Validators.required],
            stdCode: [null,Validators.required],
            didNo: [null,Validators.required],
            leadSourceId:[null,Validators.required],
            projectId:[null]
        });

        this.getLeadSources();
    }

    get f() { return this.subsourceForm.controls; }

    getLeadSources(){
        this.marketingService.getLeadSources().subscribe( res=>{
            this.leadsources = res;
        });
    }
    onClose(){
        this.ref.close();
    }
    onSave(){

        this.subsourceForm.value.projectId = localStorage.getItem('projectId');
        this.marketingService.saveLeadSubSource(this.subsourceForm.value).subscribe(res => {
            this.messageService.success('Lead sub source created');
            this.ref.close();
        },
        err =>{
            console.log(err);
        })
    }

}
