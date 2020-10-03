import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OfficeService } from '../office.service';
import { Office } from '../office-model';
import { OfficeActivityComponent } from '../office-activity/office-activity-component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'office-grid',
  templateUrl: './office-grid-component.html',

})
export class OfficeGridComponent implements OnInit {
  officeList: Office[];
  companyId: any;
  officeModel: Office;
  cols:any;

  displayedColumns = ['officeName', 'address','city','phoneNo','createdDate','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;



  constructor(private _service: OfficeService, private _route: Router, private activatedRoute: ActivatedRoute,
    private dialog:MatDialog) {
      this.companyId = localStorage.getItem('companyId');
      this.cols = [
        { field: 'officeName', header: 'Office Name' },
        { field: 'address', header: 'Address' },
        { field: 'countryId', header: 'Country' },
        { field: 'stateId', header: 'State' },
        { field: 'city', header: 'City' },
        { field: 'phoneNo',header:'Phone No'},
        { field: 'fax', header: 'Fax' },
        { field: 'createdDate', header: 'Creation Date' },
        { field: 'id', header: 'Action',width:'5%' },
      ];
  }

  refreshOfficeGrid(companyId) {
    this.getAllOffice(companyId);
  }

  ngOnInit() {
    this.getAllOffice(this.companyId);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  getAllOffice(id) {
    this._service.getAllOffice(id).subscribe(
      (office: Office[]) => {
        this.officeList = office;
        this.dataSource = new MatTableDataSource<any>(this.officeList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  deleteOffice(id) {
    this._service.deleteOffice(id).subscribe(
      res => {
        this.getAllOffice(id);
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
          officeId:0
    };

    const ref = this.dialog.open(OfficeActivityComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllOffice(this.companyId);
    });
  }

  onEdit(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
          companyId:this.companyId,
          officeId:row.id
    };

    const ref = this.dialog.open(OfficeActivityComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllOffice(this.companyId);
    });

  }

}
