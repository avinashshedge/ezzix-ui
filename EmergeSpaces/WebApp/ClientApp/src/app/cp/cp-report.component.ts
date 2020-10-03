import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";
import { ProjectService } from "../admin/project/project.service";
import { UserService } from "../admin/user/user.service";
import { CPService } from "./cp.service";


@Component({
  selector: 'cp-report',
  templateUrl: './cp-report.component.html'
})
export class CPReportComponent implements OnInit {
  projects;list; users;
   formGroup; isSubmitted;
  @ViewChild('TABLE') table: ElementRef;

  displayedColumns = ['name','mobileNo','emailId', 'projectName','leadOwner','stageDescription','createdDate','updatedDate'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allUserSelected') private allUserSelected: MatOption;
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
    private formBuilder: FormBuilder,
    private router:Router,    private service:CPService){
    this.formGroup = this.formBuilder.group({
      selectedProjects:[],
      selectedProject: [],
      selectedUser:[],
      selectedUsers: [],
      selected: {
          startDate: moment().subtract(29, 'days').set({ hours: 0, minutes: 0 }),
          endDate: moment().subtract(0, 'days').set({ hours: 23, minutes: 59 }),
      }
    });
  }
  ngOnInit(): void {
    this.getProjects();
    this.getSaleOwner();
  }


  getSaleOwner(){
    this.userService.getAllUsers().subscribe(res=>{
      this.users = res;
      this.users =this.users.filter(i => i.roleId == 7 || i.roleId == 8)
    });
  }

  getProjects(){
    this.projectService.getAllProject().subscribe(res=>{
      this.projects = res;
    });
  }
  tosslePerOne(all){
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      //return false;
    }
    if(this.formGroup.controls.selectedProjects.value.length==this.projects.length)
      this.allSelected.select();
  }

  toggleAllSelection() {
     if (this.allSelected.selected) {
       this.formGroup.controls.selectedProjects
         .patchValue([...this.projects.map(item => item.id), 0]);
     } else {
       this.formGroup.controls.selectedProjects.patchValue([]);
     }
   }

   tosslePerOneUser(all){
    if (this.allUserSelected.selected) {
      this.allUserSelected.deselect();
      //return false;
    }
    if(this.formGroup.controls.selectedUser.value.length==this.users.length)
      this.allUserSelected.select();
  }

  toggleAllSelectionUser() {
     if (this.allUserSelected.selected) {
       this.formGroup.controls.selectedUser
         .patchValue([...this.users.map(item => item.id), 0]);
     } else {
       this.formGroup.controls.selectedUser.patchValue([]);
     }
   }

   downloadPdf() {
    var prepare=[];

    this.list.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.name);
      tempObj.push('');
      tempObj.push(e.mobileNo);
      tempObj.push('');
      tempObj.push(e.emailId);
      tempObj.push('');
      tempObj.push(e.leadOwner);
      tempObj.push('');
      tempObj.push(e.projectName);
      tempObj.push('');
      tempObj.push( e.stageDescription);
      tempObj.push('');
      tempObj.push( e.createdDate);
      tempObj.push('');
      tempObj.push( e.updatedDate);
      tempObj.push('');
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    autoTable(doc, {
        head: [['Name','','Mobile No','','Email Id','','Lead Owner','', 'Project','','Stage','','Created Date','','Updated Date']],
        body: prepare
      });
    doc.save('cp_report' + '.pdf');
  }

  ExportTOExcel()
  {
    //let headers = ['Name', 'Email','Mobile Number','Projects','Role','Report To'];
    let data  = this.dataSource.data.map((x:any) =>({
      'Name':x.name,
      'Mobile No':x.mobileNo,
      'Email Id':x.emailId,
      'Lead Owner': x.leadOwner,
      'Project':x.projectName,
      'Stage':x.stageDescription,
      'Created Date':x.createdDate,
      'Updated Date':x.updatedDate
        }));

    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CP Report');

    /* save to file */
    XLSX.writeFile(wb, 'cp_report.xlsx');

  }

   onGenerate(){
     this.isSubmitted = true;
     if(this.formGroup.value.selectedProjects){
      this.formGroup.value.selectedProject = this.formGroup.value.selectedProjects.join();
     }
     if(this.formGroup.value.selectedUser){
      this.formGroup.value.selectedUsers = this.formGroup.value.selectedUser.join();
     }
    this.service.generateCPReport(this.formGroup.value).subscribe(
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
  onBack(){
    this.router.navigate(['/reports']);
  }
}
