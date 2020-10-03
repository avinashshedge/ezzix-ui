import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from "../NotificationService";
import { CPService } from "./cp.service";

@Component({
  selector:'cp-assign-to',
  templateUrl:'./cp-assign.component.html'
})

export class CPAssignToComponent implements OnInit{
  leads;  users; selectedUserId;

  constructor(private service:CPService, private ref : MatDialogRef<CPAssignToComponent>,@Inject
    (MAT_DIALOG_DATA) public data: any, public messageService :NotificationService){
  }

  ngOnInit(): void {
    this.leads = this.data.leads;
    this.getSalesUsers();
  }

  getSalesUsers(){
    this.service.getSalesUsers().subscribe(res=>{
      this.users = res;
    });
  }

  onSave(){
    var data = {
      id:this.selectedUserId,
      leads:this.leads
    };
    if (data.id == null) {
        this.messageService.warn('Please select user.');
        return;
    }

    this.service.assignCPLead(data).subscribe(res =>{
      this.messageService.success('Leads assigned to user successfully.');
      this.ref.close(data);
    });

  }
  closeModal(){
    this.ref.close();
  }
}
