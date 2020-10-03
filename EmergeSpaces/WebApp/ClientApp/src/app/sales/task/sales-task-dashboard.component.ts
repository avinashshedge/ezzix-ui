import { Component, OnInit, ViewChild } from "@angular/core";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "../../NotificationService";
import { SalesTaskDashboardService } from "./sales-task-dashboard.service";

@Component({
	selector: 'app-sales-task-dashboard',
    templateUrl: './sales-task-dashboard.component.html'
})

export class SalesTaskDashboardComponent implements OnInit{

  selectedProject;role;
  taskDetails;taskStatus;

  displayedColumns = ['leadFullName', 'type','description','status','dueDate','reminder','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private service:SalesTaskDashboardService,private router: Router,
      private messageService:NotificationService,
      private sharedService:SharedProjectService){
      this.role = localStorage.getItem('role').replace(/["']/g, "");
    }

    ngOnInit(): void {

      this.sharedService.data.subscribe(data => {
        if(data && this.router.url == '/sales/task-board'){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.getAllTasks('Monthly');
        }
      });
    }

    getAllTasks(period){
      this.service.getAllTasks(this.selectedProject,period).subscribe(res=>{
        this.taskDetails = res;
        this.taskStatus = this.taskDetails.statusData;
        this.dataSource = new MatTableDataSource<any>(this.taskDetails.taskData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }
    changeTaskStatus(taskId){
      this.service.updateTaskStatus(taskId).subscribe(()=>{
        this.messageService.success('Task updated successfully.');
        this.getAllTasks('Monthly');
      });

    }
}
