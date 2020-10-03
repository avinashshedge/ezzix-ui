import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { LeadSourceActionComponent } from "./lead-source-action.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NotificationService } from "../../NotificationService";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";

@Component({
    selector: 'lead-sources',
    templateUrl: './lead-source-list.component.html'
})

export class LeadSourceListComponent implements OnInit {
    leadSubSources:any;

    displayedColumns = ['leadSourceName','name', 'didNo','leadCount','createdBy','createdDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    selectedProject;
    constructor(
        private marketingService:MarketingService,public dialog: MatDialog,
        private sharedProjectService:SharedProjectService,
        private router:Router,
        private messageService:NotificationService){
    }

    ngOnInit(): void {
      this.sharedProjectService.data.subscribe(data => {
        if(data && this.router.url == '/marketing/lead-source'){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.getLeadSubSources();
        }
      });
    }

    getLeadSubSources(){
        this.marketingService.getLeadSubSources(this.selectedProject).subscribe(res => {
            this.leadSubSources = res;
            this.dataSource = new MatTableDataSource<any>(this.leadSubSources);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        },
        err =>{
            console.log(err);
        });
    }

    onCreate(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;

        const ref = this.dialog.open(LeadSourceActionComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
          this.getLeadSubSources();
        });
    }
}
