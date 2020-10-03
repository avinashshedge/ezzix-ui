import { Component, OnInit, Inject } from '@angular/core';
import { LeadService } from '../lead.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'bulk-update',
    templateUrl: './bulkupdate.component.html'
})
export class BulkUpdateComponent implements OnInit {
    public changeLeadOwnerTo;
    public changeLeadStageTo;
    public changeLeadSourceTo;
    public leads:any;
    public leadowners : any = [];
    public leadSources: any = [];
    selectedProject;
    constructor(private _service: LeadService, public messageService:NotificationService,
        public ref: MatDialogRef<BulkUpdateComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit() {
        this.leads = this.data.leads;
        this.selectedProject = localStorage.getItem('projectId');
        this.getAllExecutives();
        this.getLeadSources();
    }

    getAllExecutives(){
        this._service.getAllExecutiveUsers(this.selectedProject).subscribe(res => {
            this.leadowners = res;
        },
        error => {
            console.log(error);
        });
    }

    getLeadSources(){
        this._service.getLeadSources().subscribe(res => {
          this.leadSources = res;
        },
        error => {
            console.log(error);
        });
    }

    onSave(){

        var data = {
            id:this.changeLeadOwnerTo,
            stageId:this.changeLeadStageTo,
            sourceId:this.changeLeadSourceTo,
            leads:this.leads
        };
        if (data.id == null && data.stageId == null && data.sourceId == null) {
            this.messageService.warn('Please select atleast one field to update.');
            return;
        }

        this.ref.close(data);
    }

    closeModal(){
        this.ref.close();
    }

}
