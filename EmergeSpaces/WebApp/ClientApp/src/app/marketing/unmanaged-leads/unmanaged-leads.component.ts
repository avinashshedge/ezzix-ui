import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { QuickLeadComponent } from "../../lead/quick-lead/quick-lead.component";
import { LeadService } from "../../lead/lead.service";
import { NotificationService } from "../../NotificationService";
import { AssignToComponent } from "./assign-to.component";
import { UnmanagedNewLeadComponent } from "./unmanaged-new-lead.component";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { ImportLeadComponent } from "./import-lead.component";

@Component({
    selector: 'unmanaged-leads',
    templateUrl: './unmanaged-leads.component.html'
})

export class UnmanagedLeadsComponent implements OnInit {
    leadlist:any;

    displayedColumns = ['select','fullName', 'mobileNumber','emailId','sourceDescription','leadSubSource','createdBy','createdDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    selection = new SelectionModel<any>(true, []);

    selectedProject;
    constructor(private leadService:LeadService,private marketingService:MarketingService,
      private sharedProjectService:SharedProjectService,private router:Router,
      private messageService:NotificationService,public dialog: MatDialog){
    }

    ngOnInit(): void {
      this.sharedProjectService.data.subscribe(data => {
        if(data && (this.router.url == '/marketing' || this.router.url == '/marketing/unmanaged-leads')){
            this.selectedProject = data;
            localStorage.setItem('projectId',data);
            this.getUnmanagedLeads();
        }
      });
    }

    onImport(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '50%';
      dialogConfig.autoFocus = true;

      const ref = this.dialog.open(ImportLeadComponent,dialogConfig);

      ref.afterClosed().subscribe(result => {
        this.getUnmanagedLeads();
      });
    }

      /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    getUnmanagedLeads(){
        this.selection.clear();
        this.marketingService.getUnmanagedLeads(this.selectedProject).subscribe(res => {
            this.leadlist = res;
            this.dataSource = new MatTableDataSource<any>(this.leadlist);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        },
        err =>{
            console.log(err);
        });
    }

    addUnmanagedLead(){
        // if(this.selection.selected == null || this.selection.selected.length == 0){
        //     this.messageService.warn('Please select atleast one lead to update.');
        //     return;
        //   }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;


        const ref = this.dialog.open(UnmanagedNewLeadComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
            this.getUnmanagedLeads();
        });

    }

    assignTo(){

        if(this.selection.selected == null || this.selection.selected.length == 0){
            this.messageService.warn('Please select atleast one lead to assign.');
            return;
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            leads:this.selection.selected.map(a => a.id)
        };

        const ref = this.dialog.open(AssignToComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
          if(result != null){
            this.marketingService.assignTo(result).subscribe(res => {
              this.messageService.success('Lead assigned successfully.');
              this.getUnmanagedLeads();
            },
            error => {
                console.log(error);
            });
          }
        });

    }

    onRefresh(){
        this.selection.clear();
        this.getUnmanagedLeads();
    }
    onDelete(){
        //deleteUnmanagedLead
        if(this.selection.selected == null || this.selection.selected.length == 0){
            this.messageService.warn('Please select atleast one lead to assign.');
            return;
        }

        var data = {
            leads:this.selection.selected.map(i => i.id),
        };

        this.marketingService.deleteUnmanagedLead(data).subscribe(res => {
            this.messageService.success('Lead deleted successfully.');
            this.getUnmanagedLeads();
          },
          error => {
              console.log(error);
          });
    }
}
