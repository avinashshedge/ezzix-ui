import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CPService } from './cp.service';
import { CPQuickLeadComponent } from './cp-quick-lead.component';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationService } from '../NotificationService';
import { CPAssignToComponent } from './cp-assign.component';

@Component({
  selector: 'cp-lead-list',
  templateUrl: './cp-list.component.html'
})
export class CPListComponent implements OnInit {
  firms;companyId;
  displayedColumns = ['select','fullName','primaryNumber','emailId','createdDate','createdBy'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);

  constructor(private service:CPService,private dialog:MatDialog,
    private messageService:NotificationService) { }

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyId');
    this.getLeads();
  }

  getLeads(){
    this.selection.clear();
    this.service.getCPLeadList().subscribe(res =>{
      this.firms = res;
      this.dataSource = new MatTableDataSource<any>(this.firms);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(CPQuickLeadComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getLeads();
    });
  }

  onAssign(){
    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to update.');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads:this.selection.selected.map(a => a.id)
    };

    const ref = this.dialog.open(CPAssignToComponent,dialogConfig);

    ref.afterClosed().subscribe(result => {
      this.getLeads();
    });
  }

  onDelete(){
    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to delete.');
      return;
    }

    if (confirm("Are you sure you want to perform this action?")) {
      let leads = this.selection.selected.map(a => a.id);
      this.service.deleteCPLead(leads).subscribe(
        res => {
          this.getLeads();
        }
      );
    }
  }


}
