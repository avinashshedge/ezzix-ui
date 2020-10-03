import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CPFirmService } from './cpfirm.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CpfirmComponent } from './cpfirm.component';

@Component({
  selector: 'app-cpfirm-grid',
  templateUrl: './cpfirm-grid.component.html'
})
export class CpfirmGridComponent implements OnInit {
  firms;companyId;
  displayedColumns = ['firmName', 'ownerName','gstno','panNo','aadharNo','city','createdDate','createdBy','actions'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private cpfirmService:CPFirmService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyId');
    this.getAllFirms();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }
  getAllFirms(){
    this.cpfirmService.getAllFirms().subscribe(res =>{
      this.firms = res;
      this.dataSource = new MatTableDataSource<any>(this.firms);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  deleteOffice(id) {
    this.cpfirmService.deleteFirm(id).subscribe(
      res => {
        this.getAllFirms();
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
      firmId:0
    };

    const ref = this.dialog.open(CpfirmComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllFirms();
    });
  }

  onEdit(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      companyId:this.companyId,
      firmId:row.id
    };

    const ref = this.dialog.open(CpfirmComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getAllFirms();
    });
  }

  onDelete(row){
    if (confirm("Are you sure you want to perform this action?")) {
      this.cpfirmService.deleteFirm(row.id).subscribe(
        res => {
          this.getAllFirms();
        }
      );
    }
  }
}
