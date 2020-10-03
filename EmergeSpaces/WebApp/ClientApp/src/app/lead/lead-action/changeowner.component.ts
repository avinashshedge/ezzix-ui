import { Component, OnInit, Inject } from '@angular/core';
import { LeadService } from '../lead.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../NotificationService';

@Component({
    selector: 'change-owner',
    templateUrl: './changeowner.component.html'
})
export class ChangeOwnerComponent implements OnInit {
    public leads:any;
    public changeTo;selectedProject;
    public leadowners : any = [];
    constructor(private _service: LeadService, private messageService: NotificationService,
        public ref: MatDialogRef<ChangeOwnerComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
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
