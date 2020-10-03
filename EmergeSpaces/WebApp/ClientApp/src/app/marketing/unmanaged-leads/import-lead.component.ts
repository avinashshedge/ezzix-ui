import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MarketingService } from '../marketing.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'import-lead-modal',
    templateUrl: './import-lead.component.html'
})
export class ImportLeadComponent implements OnInit {

  isSubmitted = false;showResult =false;
  message = "";
    duplicateLead;addedLead; errorLead;
    @ViewChild('fileInput') fileInput;
    public duplicateLeadOption = "ignore";

    constructor(private service: MarketingService,
        private messageService:NotificationService,
        public ref: MatDialogRef<ImportLeadComponent>,
        private _route: Router, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
    }

    onImport(){

      this.showResult = false;
        if(this.fileInput.nativeElement.files.length <= 0){
             this.messageService.warn('Please select file to import.');
            return;
        }
        this.isSubmitted = true;
        let formData = new FormData();
        formData.append('upload', this.fileInput.nativeElement.files[0])
        formData.append('projectId',localStorage.getItem('projectId'));
        this.service.uploadExcel(formData).subscribe(res => {
          this.isSubmitted = false;
          this.showResult = true;
          let  result :any= res;
          this.message = result.message;
          this.duplicateLead = result.duplicateLead;
          this.addedLead= result.addedLead;
          this.errorLead = result.errorLead;
          this.fileInput.nativeElement.value = "";
          //this.closeModal();
        },
         error => {
          console.log(error);
        });

    }


    openFileUpload(event:any){
        event.preventDefault();
        let element:HTMLElement = document.getElementById('fileInput') as HTMLElement;
        element.click();
    }

    closeModal() {
        this.ref.close();
    }

}
