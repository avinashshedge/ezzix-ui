import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { LeadListActionComponent } from "./lead-list-action.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";

@Component({
    selector: 'lead-list',
    templateUrl: './lead-list.component.html'
})

export class LeadListComponent implements OnInit {
    leadlist:any;

    displayedColumns = ['listName', 'criteria','createdBy','createdDate','updatedBy','updatedDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    selectedProject;
    constructor(private marketingService:MarketingService,
      private router:Router,
      private sharedProjectService:SharedProjectService,
      private dialog:MatDialog){

    }

    ngOnInit(): void {
      this.sharedProjectService.data.subscribe(data => {
        if(data && this.router.url == '/marketing/lead-list'){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.getManagedLeadList();
        }
      });
    }

    getManagedLeadList(){
        this.marketingService.getLeadList(this.selectedProject).subscribe(res => {
            this.leadlist = res;
            this.dataSource = new MatTableDataSource<any>(this.leadlist);
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
        dialogConfig.data = {
              leadListId:0,
        };

        const ref = this.dialog.open(LeadListActionComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
          this.getManagedLeadList();
        });
    }
}
