
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';


@Component({
  selector: 'user-grid',
  templateUrl: './user-grid-component.html',

})
export class UserGridComponent implements OnInit ,AfterViewInit {
  loadingIndicator = true;
  userList: any;
  public userId: any;
  public cols:any = [];

  displayedColumns = ['fullName', 'emailId','selectedProject','roleDescription','phoneNumber','reportToName','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _service:UserService,private route:Router){}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers();
  }

  getAllUsers() {
    this._service.getAllUsers().subscribe(
      res => {
        this.userList = res;
        this.dataSource = new MatTableDataSource<any>(this.userList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    );
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  onEdit(element) {
    this.route.navigate(['admin/user-edit', { id: element.id }]);
  }
  onReset(){
    this.getAllUsers();
  }

  updateActiveStatus(element) {
    if (confirm("Are you sure you want to perform this action?")) {
      this._service.deleteUser(element.id).subscribe(
        res => {
          this.getAllUsers();
        }
      );
    }
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }
}


