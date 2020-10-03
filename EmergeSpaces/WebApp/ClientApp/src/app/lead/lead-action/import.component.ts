import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';

@Component({
    selector: 'import-modal',
    templateUrl: './import.component.html'
})
export class ImportComponent implements OnInit {

    @ViewChild('fileInput') fileInput;
    public duplicateLeadOption = "ignore";

    constructor(private _service: LeadService,
        private _route: Router, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
    }

    onImport(){
        if(this.fileInput.nativeElement.files.length <= 0){
            //this.toastr.error("please select file to import");
            return;
        }
        let formData = new FormData();  
        formData.append('upload', this.fileInput.nativeElement.files[0])  
        formData.append('duplicateLeadOption',this.duplicateLeadOption);
        this._service.uploadExcel(formData).subscribe(res => {  
          if(res == "success"){
            //this.toastr.success("Leads imported successfully.");
          } 
          else{
            //this.toastr.error("An error occured while importing.");
          }   
          this.fileInput.nativeElement.value = "";
          this.closeModal();
          this._route.navigate(['/lead']);  
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
    
    showModal() {
       // this.importModal.show();
    }
    closeModal() {
       // this.importModal.hide();
    }

}
