import { Component, OnInit, ViewChild } from '@angular/core';
import { CpuserComponent } from './cpuser.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CPUserService } from './cpuser.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cpuser-grid',
  templateUrl: './cpuser-grid.component.html'
})
export class CpuserGridComponent implements OnInit {

  users;companyId;
  displayedColumns = ['fullName', 'firmName','emailId','mobileNo','dob','gender','createdDate','createdBy','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private cpfirmService:CPUserService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyId');
    this.getAllCpUsers();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  getAllCpUsers(){
    this.cpfirmService.getAllCPUsers().subscribe(res =>{
      this.users = res;
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      companyId:this.companyId,
      userId:0
    };

    const ref = this.dialog.open(CpuserComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllCpUsers();
    });
  }

  onEdit(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      companyId:this.companyId,
      userId:row.id
    };

    const ref = this.dialog.open(CpuserComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllCpUsers();
    });
  }

  onDelete(row){
    if (confirm("Are you sure you want to perform this action?")) {
      this.cpfirmService.deleteCPUser(row.id).subscribe(
        res => {
          this.getAllCpUsers();
        }
      );
    }
  }

}
