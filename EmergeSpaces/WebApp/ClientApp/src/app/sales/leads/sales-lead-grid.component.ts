import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from '../../helper-component/shared.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../NotificationService';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { SalesService } from '../sales.service';
import { SharedProjectService } from '../../layouts/full/service/shared-project.service';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'sales-lead',
  templateUrl: './sales-lead-grid.component.html'
})
export class SalesLeadGridComponent implements OnInit {
  public fromDate :any;stages;
  public toDate : any;
  public leadList: any;
  public selectedLeads : any = [];
  public userId: any;
  dateFilters: any;
  clickEventsubscription:Subscription;

  @ViewChild('fileInput') fileInput;
  displayedColumns = ['select','fullName', 'emailId','primaryMobile','leadOwnerName','sourceDescription','lastNote','stageDescription','updatedBy','createdDate'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);


  owners;sources;
  ranges = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
};

  cpUserFilter;leadStageFilter;leadOwnerFilter;leadSourceFilter;

  dateTypeFilter;
  form;
  public leads;selectedProject;cpusers;
  public cols: any[];

  constructor(private _service: SalesService,private router: Router,private dialog:MatDialog,
    private messageService:NotificationService, private sharedService:SharedService,
    private formBuilder: FormBuilder,
    private sharedProjectService:SharedProjectService,) {

    this.clickEventsubscription=this.sharedService.getClickEvent().subscribe(()=>{
      this.getAllLeads();
    });

    this.form = this.formBuilder.group({
      selected: {
          startDate: moment().subtract(29, 'days').set({ hours: 0, minutes: 0 }),
          endDate: moment().subtract(0, 'days').set({ hours: 23, minutes: 59 }),
      },
      alwaysShowCalendars: true,
      keepCalendarOpeningWithRange: true,
      showRangeLabelOnInput: true,
  });
  }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.getLeadStages();
    this.getLeadSources();
    this.getCPUsers();

    this.sharedProjectService.data.subscribe(data => {
      if(data && this.router.url == '/sales/lead-list'){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.getLeadOwners();
        this.getAllLeads();
      }
    });
  }

  getCPUsers(){
    this._service.getCPUsers().subscribe(res => {
      this.cpusers = res;
    });
  }

  datesUpdated(range) {
    if(this.form.value.selected.startDate && this.form.value.selected.endDate){

      var request = {
        startDate : this.form.value.selected.startDate,
        endDate:this.form.value.selected.endDate,
        type:this.dateTypeFilter,
        projectId:this.selectedProject
      };

      this.selection.clear();
      this._service.filterLeadList(request).subscribe(
        res => {
          this.leads = res;
          this.dataSource = new MatTableDataSource<any>(this.leads);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.createFilter();
        }
      );

    }
  }

getLeadStages(){
  this._service.getLeadStages().subscribe(res => {
    this.stages = res;
  });
}

getLeadSources(){
  this._service.getLeadSources().subscribe(res => {
    this.sources = res;
  });
}

getLeadOwners(){
  this._service.getSaleLeadOwners(this.selectedProject).subscribe(res => {
    this.owners = res;
  });
}

onCPUserChange(){
  this.filterValues.cpuser = this.cpUserFilter;
  this.dataSource.filter = JSON.stringify(this.filterValues).toString();

}

onLeadStageChange(){
  this.filterValues.stage = this.leadStageFilter;
  this.dataSource.filter = JSON.stringify(this.filterValues).toString();
}

onLeadSourceChange(){
  this.filterValues.leadSource = this.leadSourceFilter;
  this.dataSource.filter = JSON.stringify(this.filterValues).toString();
}

onLeadOwnerChange(){
  this.filterValues.leadOwner = this.leadOwnerFilter;
  this.dataSource.filter = JSON.stringify(this.filterValues).toString();
}


filterValues = {
  stage: '',
  cpuser:'',
  leadSource: '',
  leadOwner:'',
  all: ''
};

createFilter(): (data: any, filter: string) => boolean {
  let filterFunction = function(data, filter): boolean {
    let searchTerms = JSON.parse(filter);
    return (data.fullName.toLowerCase().includes(searchTerms.all)
      || data.emailId.toString().toLowerCase().includes(searchTerms.all)
      || data.primaryMobile.toString().toLowerCase().includes(searchTerms.all))
      && (searchTerms.stage == undefined
            || data.stage.toString().indexOf(searchTerms.stage) != -1)
      && (searchTerms.leadSource == undefined
            || data.leadSource.toString().indexOf(searchTerms.leadSource) != -1)
      && (searchTerms.leadOwner == undefined
              || data.leadOwner.toString().indexOf(searchTerms.leadOwner) != -1)
      && (searchTerms.cpuser == undefined
        || (data.cpUserId != null && data.cpUserId.toString().indexOf(searchTerms.cpuser) != -1));
  }
  return filterFunction;
}



applyFilter(filterValue: string) {
  this.filterValues.all = filterValue.toLowerCase();
  this.dataSource.filter = JSON.stringify(this.filterValues);
  //this.dataSource.filterPredicate = this.createFilter();
}

  /** Whether the number of selected elements matches the total number of rows. */
 /** Whether the number of selected elements matches the total number of rows. */
 private findStartEndIndices(): {startIndex: number, endIndex: number} {
  const pageIndex = this.dataSource.paginator.pageIndex;
  const pageSize = this.dataSource.paginator.pageSize;
  const total = this.dataSource.paginator.length;
  const startIndex = pageIndex * pageSize;
  const endIndex = (startIndex + pageSize) > total ? total : startIndex + pageSize;
  return {startIndex: startIndex, endIndex: endIndex};
}

isAllSelected() {
  const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();
  const sortedData = this.dataSource._orderData(this.dataSource.data);
  const numSelected = sortedData.slice(page.startIndex, page.endIndex)
    .filter( row => this.selection.isSelected(row)).length;

  return numSelected === (page.endIndex - page.startIndex);
}

isAtLeaseOneSelected() {
  const page: {startIndex: number, endIndex: number} =
    this.findStartEndIndices();
  const sortedData = this.dataSource._orderData(this.dataSource.data);
  const numSelected = sortedData.slice(page.startIndex, page.endIndex)
    .filter( row => this.selection.isSelected(row)).length;
  return numSelected > 0;
}

sortChange(event){
  this.selection.clear();
}
masterToggle() {
  debugger;
  const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();

  const sortedData = this.dataSource._orderData(this.dataSource.data);

  if (this.isAllSelected()) {
    sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
      this.selection.deselect(row);
    });
  } else {
    sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
        this.selection.select(row);
    });
  }
}

rowToggle(row) {
  this.selection.toggle(row);
  row.selected = !row.selected;

  // if (this.sort.active === 'selected' && this.sort.direction !== '') {
  //   const original = this.dataSource.data;
  //   this.dataSource.data = this.dataSource._orderData(this.dataSource.data);
  //   this.dataSource.data = original;
  // }
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
    if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

  onSendSMS(){
    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to update.');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads:this.selection.selected.map(a => a.id)
    };

    // const ref = this.dialog.open(SMSComponent,dialogConfig);
    // ref.afterClosed().subscribe(result => {
    // });

  }

  onSendEmail(){

    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to update.');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '70%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads:this.selection.selected.map(a => a.id)
    };

    // const ref = this.dialog.open(EmailComponent,dialogConfig);

    // ref.afterClosed().subscribe(result => {
    // });
}

  showChangeOwner(){
    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to update.');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      leads:this.selection.selected.map(a => a.id)
    };

    // const ref = this.dialog.open(ChangeOwnerComponent,dialogConfig);

    // ref.afterClosed().subscribe(result => {
    //   if(result != null){
    //     this._service.changeOwner(result).subscribe(res => {
    //       this.messageService.success('Lead updated successfully.');
    //       this.getAllLeads();
    //     },
    //     error => {
    //         console.log(error);
    //     });
    //   }
    // });

  }

  getAllLeads() {
    this.selection.clear();
    this._service.getAllLeads(this.selectedProject).subscribe(
      res => {
        this.leads = res;
        this.dataSource = new MatTableDataSource<any>(this.leads);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();

      }
    );
  }

  onRefresh(){
    this.getAllLeads();
  }

  onReset(){
    this.getAllLeads();
  }

  onDelete(){

    if(this.selection.selected == null || this.selection.selected.length == 0){
      this.messageService.warn('Please select atleast one lead to update.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._service.deleteLeads(this.selectedLeads).subscribe(res => {
            this.getAllLeads();
            this.messageService.success('Lead deleted successfully');
          },
            error => {
            console.log(error);
          });
        }
    });

  }

}
