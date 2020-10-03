import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../project-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { ProjectActivityComponent } from '../project-activity/project-activity-component';

@Component({
  selector: 'project-grid',
  templateUrl: './project-grid-component.html',

})
export class ProjectGridComponent implements OnInit {
  projectList: Project[];
  id: any;
  cols:any;
  companyId: any;
  projectModel: Project;

  displayedColumns = ['projectName', 'projectCode','estimatedStartDate','estimatedEndDate','createdDate','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private _service: ProjectService, private _route: Router, private activatedRoute: ActivatedRoute,
    private dialog:MatDialog) {

      this.companyId = localStorage.getItem('companyId');
      this.cols = [
        { field: 'projectName', header: 'Project Name' },
        { field: 'projectCode', header: 'Project Code' },
        { field: 'estimatedStartDate', header: 'Estimated Start Date' },
        { field: 'estimatedEndDate', header: 'Estimated End Date' },
        { field: 'propertyDetails',header:'Property Details'},
        { field: 'createdDate', header: 'Creation Date' },
        { field: 'id', header: 'Action',width:'5%' },
      ];
  }

  ngOnInit() {
    this.getAllProject(this.companyId);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  refreshProjectGrid(companyId) {
    this.getAllProject(companyId);
  }

  getAllProject(id){
    this._service.getProjectsByCompanyId(id).subscribe(
      (res: Project[]) => {
        this.projectList = res;
        this.dataSource = new MatTableDataSource<any>(this.projectList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

  deleteProject(id) {
    this._service.deleteProject(id).subscribe(
      res => {
        this.getAllProject(id);
      }
    );
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
          companyId:this.companyId,
          projectId:0
    };

    const ref = this.dialog.open(ProjectActivityComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllProject(this.companyId);
    });
  }

  onEdit(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
          companyId:this.companyId,
          projectId:row.id
    };

    const ref = this.dialog.open(ProjectActivityComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllProject(this.companyId);
    });
  }


}
