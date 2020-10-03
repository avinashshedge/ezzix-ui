import { Component, OnInit } from '@angular/core';
import { EmailTemplateComponent } from './email-template.component';
import { MarketingService } from '../marketing.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../NotificationService';
import { SharedProjectService } from '../../layouts/full/service/shared-project.service';

@Component({
  selector: 'app-email-template-list',
  templateUrl: './email-template-list.component.html'
})
export class EmailTemplateListComponent implements OnInit {
  data = [];
  page = 0;
  size = 10;
  public cols;
  public templates:any = [];
  selectedProject;
  constructor(private marketingService:MarketingService,private router: Router,
    private sharedProjectService:SharedProjectService,
    public dialogService: MatDialog,private messageService:NotificationService){

    this.cols = [
        { field: 'templateName', header: 'Template Name' },
        { field: 'templateHtml', header: 'Preview' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'CreatedDate', header: 'Creation Date' },
        { field: 'updatedBy', header:'Modified By'},
        { field: 'updatedDate', header: 'Modification Date' }
    ];
  }

  ngOnInit() {
    this.sharedProjectService.data.subscribe(data => {
      if(data && this.router.url == '/marketing/email-templates'){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.getEmailTemplateList();
        }
      });


  }



getData(obj) {
  let index=0,
      startingIndex=obj.pageIndex * obj.pageSize,
      endingIndex=startingIndex + obj.pageSize;

  this.data = this.templates.filter(() => {
    index++;
    return (index > startingIndex && index <= endingIndex) ? true : false;
  });
}

  redirectToDashboard(){
    this.router.navigate(['marketing/email-campaigns']);
  }

  redirectToTemplate(){
    this.router.navigate(['marketing/email-template']);
  }



  onDesktopPreview(value){
      let printContents, popupWin;
      printContents = value;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=720px,width=1280px');
      popupWin.document.open();
      popupWin.document.write(`${printContents}`
      );
      popupWin.document.close();
  }

  onTabletPreview(value){
      let printContents, popupWin;
      printContents = value;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=600px,width=1024px');
      popupWin.document.open();
      popupWin.document.write(`${printContents}`
      );
      popupWin.document.close();
  }

  onMobilePreview(value){
      let printContents, popupWin;
      printContents = value;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=640px,width=360px');
      popupWin.document.open();
      popupWin.document.write(`${printContents}`
      );
      popupWin.document.close();
  }
  getEmailTemplateList(){
    this.marketingService.getEmailTemplateList(this.selectedProject).subscribe(res => {
      this.templates = res;
      this.getData({pageIndex: this.page, pageSize: this.size});
    },
    err =>{
        console.log(err);
    });
  }

}
