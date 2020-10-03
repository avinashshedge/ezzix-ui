import { Component, OnInit, Inject } from '@angular/core';
import { LeadService } from '../lead.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'change-stage',
    templateUrl: './changestage.component.html'
})
export class ChangeStageComponent implements OnInit {

    public leads:any;
    public changeTo;
    public leadowners : any = [];
    constructor(private _service: LeadService,private messageService: NotificationService,
        public ref: MatDialogRef<ChangeStageComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit() {
        this.leads = this.data.leads;
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
