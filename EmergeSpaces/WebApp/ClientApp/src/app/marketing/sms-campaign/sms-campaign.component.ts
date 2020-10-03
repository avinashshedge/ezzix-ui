import { OnInit, Component, ViewChild } from "@angular/core";
import { SMSTemplateComponent } from "./sms-template.component";
import { MarketingService } from "../marketing.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../NotificationService";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'app-sms-campaign',
    templateUrl: './sms-campaign.component.html'
  })
  export class SMSCampaignComponent implements OnInit {

    public templates;selectedProject;
    selection = new SelectionModel<any>(true, []);

    displayedColumns = ['templateName', 'description','type','visibility','createdBy','createdDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private marketingService:MarketingService,private router: Router,
      private sharedProjectService:SharedProjectService,
                public dialog: MatDialog,private messageService:NotificationService){
    }

  ngOnInit() {
    this.sharedProjectService.data.subscribe(data => {
      if(data && this.router.url == '/marketing/sms-template'){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.getSMSTemplateList();
      }
    });
  }

  getSMSTemplateList(){
    this.marketingService.getSMSTemplateList(this.selectedProject).subscribe(res => {
        this.templates = res;
        this.dataSource = new MatTableDataSource<any>(this.templates);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      err =>{
          console.log(err);
      });
  }

  backToCampaignList(){
    this.router.navigate(['marketing/sms-campaign']);
  }

  openSMSTemplateModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(SMSTemplateComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getSMSTemplateList();
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


}
