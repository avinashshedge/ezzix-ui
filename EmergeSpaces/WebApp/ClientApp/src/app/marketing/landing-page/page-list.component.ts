import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { PageActionComponent } from "./page-action.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";

@Component({
    selector: 'page-list',
    templateUrl: './page-list.component.html'
})

export class PageListComponent implements OnInit {
    pagelist:any = [];
    displayedColumns = ['name', 'type','url','script','leadCount','createdBy','createdDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    selectedProject;
    constructor(private sharedProjectService:SharedProjectService,
      private router:Router,private marketingService:MarketingService,public dialog: MatDialog){
    }

    ngOnInit(): void {
      this.sharedProjectService.data.subscribe(data => {
        if(data && this.router.url == '/marketing/landing-page'){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.getPages();
        }
      });
    }

    getPages(){
        this.marketingService.getPages(this.selectedProject).subscribe(res => {
            this.pagelist = res;
            this.dataSource = new MatTableDataSource<any>(this.pagelist);
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

        const ref = this.dialog.open(PageActionComponent,dialogConfig);

        ref.afterClosed().subscribe(result => {
          this.getPages();
        });
    }
}
