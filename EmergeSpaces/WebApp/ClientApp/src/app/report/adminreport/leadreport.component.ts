import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import { ProjectService } from "../../admin/project/project.service";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import * as moment from "moment";
import { AdminReportService } from "./adminreport.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { UserService } from "../../admin/user/user.service";
import { Router } from "@angular/router";


@Component({
  selector: 'leads-report',
  templateUrl: './leadreport.component.html'
})
export class LeadReportComponent implements OnInit {
  projects;list;  formGroup; isSubmitted;

  users;stages;

  displayedColumns = ['fullName',  'emailId',  'primaryMobile',  'projectNames',  'stageDescription',  'sourceDescription',  'createdDate',  'createdBy','updatedDate',  'updatedBy'];

  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelectedStage') private allSelectedStage: MatOption;
  @ViewChild('allSelectedUsers') private allSelectedUsers: MatOption;
  invalidDates: moment.Moment[] = [];

  ranges = {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  };

  constructor(private projectService:ProjectService,private userService:UserService,
    private router:Router,    private formBuilder: FormBuilder,    private adminreport:AdminReportService){

      this.formGroup = this.formBuilder.group({
      selectedProject: [],
      selectedStage: [],
      selectedUsers: [],
      selected: {
          startDate: moment().subtract(29, 'days').set({ hours: 0, minutes: 0 }),
          endDate: moment().subtract(0, 'days').set({ hours: 23, minutes: 59 }),
      }
    });
  }
  ngOnInit(): void {
    this.stages =[{ 'id': '1', 'name': 'Fresh Lead'},
                  { 'id': '2', 'name': 'Hot'},
                  { 'id': '3', 'name': 'Warm'},
                  { 'id': '4', 'name': 'Cold'},
                  { 'id': '5', 'name': 'Dead'},
                  { 'id': '6', 'name': 'Booking Done'},
                  { 'id': '7', 'name': 'Assigned'},]

    this.getProjects();
    this.getUsers();
  }

  getProjects(){
    this.projectService.getAllProject().subscribe(res=>{
      this.projects = res;
    });
  }

  getUsers(){
    this.userService.getAllUsers().subscribe(res=>{
      this.users = res;
    });
  }

  tosslePerOne(all){
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      //return false;
    }
    if(this.formGroup.controls.selectedProject.value.length==this.projects.length)
      this.allSelected.select();
  }

  toggleAllSelection() {
     if (this.allSelected.selected) {
       this.formGroup.controls.selectedProject
         .patchValue([...this.projects.map(item => item.id), 0]);
     } else {
       this.formGroup.controls.selectedProject.patchValue([]);
     }
   }

   tosslePerOneStage(all){
    if (this.allSelectedStage.selected) {
      this.allSelectedStage.deselect();
      //return false;
    }
    if(this.formGroup.controls.selectedStage.value.length==this.stages.length)
      this.allSelectedStage.select();
  }

  toggleAllSelectionStage() {
     if (this.allSelectedStage.selected) {
       this.formGroup.controls.selectedStage
         .patchValue([...this.stages.map(item => item.id), 0]);
     } else {
       this.formGroup.controls.selectedStage.patchValue([]);
     }
   }

   tosslePerOneUser(all){
    if (this.allSelectedUsers.selected) {
      this.allSelectedUsers.deselect();
      //return false;
    }
    if(this.formGroup.controls.selectedUsers.value.length==this.users.length)
      this.allSelectedUsers.select();
  }

  toggleAllSelectionUser() {
     if (this.allSelectedUsers.selected) {
       this.formGroup.controls.selectedUsers
         .patchValue([...this.users.map(item => item.id), 0]);
     } else {
       this.formGroup.controls.selectedUsers.patchValue([]);
     }
   }


   downloadPdf() {
    var prepare=[];

    this.list.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.fullName);
      tempObj.push('');
      tempObj.push(e.emailId);
      tempObj.push('');
      tempObj.push( e.primaryMobile);
      tempObj.push('');
      tempObj.push( e.projectNames);
      tempObj.push('');
      tempObj.push( e.stageDescription);
      tempObj.push('');
      tempObj.push( e.sourceDescription);
      tempObj.push('');
      tempObj.push( e.createdDate);
      tempObj.push('');
      tempObj.push( e.createdBy);
      tempObj.push('');
      tempObj.push( e.updatedDate);
      tempObj.push('');
      tempObj.push( e.updatedBy);
      prepare.push(tempObj);
    });

    const doc = new jsPDF('p', 'mm', [500, 480]);
    autoTable(doc, {
        head: [['Name','', 'Email Id','','Mobile No','','Project','','Stage',
        '','Source','','Created Date','','Created By','','Updated Date','','Updated By']],
        body: prepare
      });
    doc.save('lead_report' + '.pdf');
  }

  ExportTOExcel()
  {
    let data  = this.dataSource.data.map((x:any) =>({
      'Name': x.fullName,
      'Email Id': x.emailId,
      'Mobile No': x.primaryMobile,
      'Project':x.projectNames,
      'Stage':x.stageDescription,
      'Source':x.sourceDescription,
      'Created Date':x.createdDate,
      'Created By':x.createdBy,
      'Updated Date':x.updatedDate,
      'Updated By':x.updatedBy
    }));

    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Report');

    /* save to file */
    XLSX.writeFile(wb, 'lead_report.xlsx');

  }
  onBack(){
    this.router.navigate(['/reports']);
  }

   onGenerate(){
     this.isSubmitted = true;

     var request = {
      selectedProject:this.formGroup.value.selectedProject?.join(),
      selectedStage : this.formGroup.value.selectedStage?.join(),
      selectedUsers : this.formGroup.value.selectedUsers?.join(),
      selected:this.formGroup.value.selected
     }

    this.adminreport.generateLeadsReport(request).subscribe(
      res=>
      {
        this.isSubmitted = false;
        this.list = res;
        this.dataSource = new MatTableDataSource<any>(this.list);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
     },err =>{
      this.isSubmitted = false;
     }
     )
  }
}
