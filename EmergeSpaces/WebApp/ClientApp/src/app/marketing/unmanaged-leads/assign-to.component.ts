import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../NotificationService';
import { LeadService } from '../../lead/lead.service';

@Component({
    selector: 'assign-to',
    templateUrl: './assign-to.component.html'
})
export class AssignToComponent implements OnInit {
    public leads:any;
    public changeTo;
    public leadowners : any = [];
    selectedProject;
    constructor(private _service: LeadService, private messageService: NotificationService,
        public ref: MatDialogRef<AssignToComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.leads = this.data.leads;
        this.selectedProject = localStorage.getItem('projectId');
        this.getAllExecutives();
    }

    getAllExecutives(){
        this._service.getAllExecutiveUsers(this.selectedProject).subscribe(res => {
            this.leadowners = res;
        },
        error => {
            console.log(error);
        });
    }

    onSave(){

        var data = {
            id:this.changeTo,
            leads:this.leads,
        };

        if(this.changeTo == undefined || this.changeTo == ""){
            this.messageService.warn("Select Change to lead owner");
            return;
        }
        this.ref.close(data);
    }

    closeModal(){
        this.ref.close();
    }
}
