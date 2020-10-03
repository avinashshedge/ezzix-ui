import { OnInit, Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../../NotificationService";
import { AutomationService } from "./automation.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
@Component({
    selector: 'automation-list',
    templateUrl: './automation-list.component.html'
})

export class AutomationListComponent implements OnInit {
    automationList:any;
    displayedColumns = ['name', 'projectName','trigger','createdBy','createdDate','actions'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private _route: Router,  private service:AutomationService,
        public dialogService: MatDialog, private messageService:NotificationService){
    }

    ngOnInit(): void {
        this.getAutomationList();
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim();
    }

    editAutomate(id){
        this._route.navigate(['admin/automation-edit/'+id]);
    }

    getAutomationList(){
        this.service.getAutomationList().subscribe(res =>{
            this.automationList = res;
            this.dataSource = new MatTableDataSource<any>(this.automationList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        })
    }

    openCreateAutomationModal(){
        this._route.navigate(['/admin/automation-action']);
    }

    updateActiveStatus(element){
        if (confirm("Are you sure you want to perform this action?")) {
            this.service.updateActiveStatus(element.id).subscribe( res =>{

            });
          }
    }
}
