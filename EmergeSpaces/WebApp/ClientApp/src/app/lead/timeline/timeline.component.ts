import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { EmailComponent } from '../lead-action/email.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SMSComponent } from '../lead-action/sms.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  lead: any;type;
  leadId;
  selectedLeads:any = [];

  constructor(private _service: LeadService, private dialog:MatDialog,private activatedRoute: ActivatedRoute ) {
    this.activatedRoute.params.subscribe(params => { 
      this.leadId = params['id'];
      this.type = params['type'];
      this.selectedLeads.push(this.leadId);
    });
    
  }

  ngOnInit() {
    this.getLeadDetails();
   }

   onTabChange(event) {
    //this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }
  
  getLeadDetails() {
    
    this._service.getLeadDetails(this.leadId).subscribe(
      res => {
        this.lead = res;
      }
    );
  }

  onSendSMS(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads: [this.leadId]
    };

    const ref = this.dialog.open(SMSComponent,dialogConfig);
      ref.afterClosed().subscribe(result => {
      });

  }

  onSendEmail(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '70%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads:[this.leadId]
    };

    const ref = this.dialog.open(EmailComponent,dialogConfig); 

    ref.afterClosed().subscribe(result => {
    });

  }
 
  onReset(){
    this.getLeadDetails();
  }


  onClone(){
    // if (this.selectedLeads == undefined || this.selectedLeads.length <= 0) {
    //   this.messageService.add({severity:'error', summary: 'Error Message', detail:"Select Lead before cloning"});
    //   return;
    // }

    // this._service.cloneLead(this.selectedLeads).subscribe(res => {
    //   this.messageService.add({severity:'success', summary: 'Success Message', detail:"Lead Clone successfully"});
    // },
    // error => {
    //   console.log(error);
    // });  
  }

  onDelete(){
    // if(this.selectedLeads == undefined || this.selectedLeads.length <= 0){
    //   this.messageService.add({severity:'error', summary: 'Error Message', detail:"Select Lead before delete"});
    //   return;
    // }
    // if(confirm("Are you sure you want to delete leads")) {
    //   this._service.deleteLeads(this.selectedLeads).subscribe(res => {  
    //     this.messageService.add({severity:'error', summary: 'Error Message', detail:"Lead deleted successfully"});
    //     this._route.navigate(["/lead"]);
    //   },
    //    error => {
    //     console.log(error);
    //   });  
      
    // }
  }


  showChangeStage(){
    // const ref = this.dialogService.open(ChangeStageComponent, {
    //   header: 'Change Stage',
    //   data:{
    //     leads:this.selectedLeads
    //   },
    //   width: '30%'
    // });

    // ref.onClose.subscribe((data: any) => {
    //   if ( data.id == null) {
    //     this.messageService.add({severity:'error', summary: 'Error Message', detail:'Please select atleast one field to update.'});
    //   }
    //   else{
    //       data.leads = this.selectedLeads;
    //       this._service.changeStage(data).subscribe(res => {
    //         this.messageService.add({severity:'success', summary: 'Success Message', detail:'Lead updated successfully.'});
    //       },
    //       error => {
    //           console.log(error);
    //       });
    //   }
    // });

  }

  showChangeOwner(){
    // const ref = this.dialogService.open(ChangeOwnerComponent, {
    //   header: 'Change Owner',
    //   data:{
    //     leads:this.selectedLeads
    //   },
    //   width: '30%'
    // });

    // ref.onClose.subscribe((data: any) => {
    //   if ( data.id == null) {
    //     this.messageService.add({severity:'error', summary: 'Error Message', detail:'Please select atleast one field to update.'});
    //   }
    //   else{
    //       data.leads = this.selectedLeads;
    //       this._service.changeOwner(data).subscribe(res => {
    //         this.messageService.add({severity:'success', summary: 'Success Message', detail:'Lead updated successfully.'});
    //       },
    //       error => {
    //           console.log(error);
    //       });
    //   }
    // });

  }


  mymessages: Object[] = [
    {
        useravatar: 'assets/images/users/1.jpg',
        status: 'online',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:30 AM'
    },
    {
        useravatar: 'assets/images/users/2.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
    },
    {
        useravatar: 'assets/images/users/3.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
    },
    {
        useravatar: 'assets/images/users/4.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
    },
    {
        useravatar: 'assets/images/users/6.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
    },
    {
        useravatar: 'assets/images/users/7.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
    },
    {
        useravatar: 'assets/images/users/8.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
    }
];
}