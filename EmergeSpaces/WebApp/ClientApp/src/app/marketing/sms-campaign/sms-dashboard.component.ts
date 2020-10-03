import { OnInit, Component, ViewChild } from "@angular/core";
import { SMSTemplateComponent } from "./sms-template.component";
import { MarketingService } from "../marketing.service";
import { Router } from "@angular/router";
import { SMSBuildComponent } from "./sms-build-campaign.component";
import { NotificationService } from "../../NotificationService";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { SelectionModel } from "@angular/cdk/collections";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
    selector: 'app-sms-dashboard',
    templateUrl: './sms-dashboard.component.html'
  })
  export class SMSDashboardComponent implements OnInit {
    public cols;
    public campaigns;public templates;
    selectedProject;

    selection = new SelectionModel<any>(true, []);
    displayedColumns = ['select','name', 'template','recipientCount','scheduledOn','createdBy','createdDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private marketingService:MarketingService,private router: Router,

      private sharedProjectService:SharedProjectService,
                public dialog: MatDialog,private messageService:NotificationService){

  }
  ngOnInit() {
    this.sharedProjectService.data.subscribe(data => {
      if(data && this.router.url == '/marketing/sms-campaign'){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.getCampaigns();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  private findStartEndIndices(): {startIndex: number, endIndex: number} {
    const pageIndex = this.dataSource.paginator.pageIndex;
    const pageSize = this.dataSource.paginator.pageSize;
    const total = this.dataSource.paginator.length;
    const startIndex = pageIndex * pageSize;
    const endIndex = (startIndex + pageSize) > total ? total : startIndex + pageSize;
    return {startIndex: startIndex, endIndex: endIndex};
  }

  isAllSelected() {
    const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();
    const sortedData = this.dataSource._orderData(this.dataSource.data);
    const numSelected = sortedData.slice(page.startIndex, page.endIndex)
      .filter( row => this.selection.isSelected(row)).length;

    return numSelected === (page.endIndex - page.startIndex);
  }

  isAtLeaseOneSelected() {
    const page: {startIndex: number, endIndex: number} =
      this.findStartEndIndices();
    const sortedData = this.dataSource._orderData(this.dataSource.data);
    const numSelected = sortedData.slice(page.startIndex, page.endIndex)
      .filter( row => this.selection.isSelected(row)).length;
    return numSelected > 0;
  }

  sortChange(event){
    this.selection.clear();
  }
  masterToggle() {

    const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();

    const sortedData = this.dataSource._orderData(this.dataSource.data);

    if (this.isAllSelected()) {
      sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
        this.selection.deselect(row);
      });
    } else {
      sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
          this.selection.select(row);
      });
    }
  }

  rowToggle(row) {
    this.selection.toggle(row);
    row.selected = !row.selected;

  }

  deleteCampaign(){
    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one campaign.');
      return;
    }



    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      let campaigns = this.selection.selected.map(a => a.id);

      if (confirmed) {
        this.marketingService.deleteSMSCampaign(campaigns).subscribe(res => {
            this.getCampaigns();
            this.messageService.success('Campaign deleted successfully');
          },
            error => {
            console.log(error);
          });
        }
    });

  }

  getCampaigns(){
    this.marketingService.getSMSCampaignList(this.selectedProject).subscribe(res => {
        this.campaigns = res;
        this.dataSource = new MatTableDataSource<any>(this.campaigns);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      err =>{
          console.log(err);
      });
  }

  openSMSCampaignModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(SMSBuildComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      debugger;
      if(result > 0){
        this.runCampaign(result);
      }
      this.getCampaigns();
    });
  }

  runCampaign(campaignId){
    this.marketingService.runSMSCampaign(campaignId).subscribe(res=>{

    });
  }
  gotoList(){
    this.router.navigate(['marketing/sms-template']);
  }

  openSMSTemplateModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(SMSTemplateComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getCampaigns();
    });
  }

}
