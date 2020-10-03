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
import { Router } from "@angular/router";


@Component({
  selector: 'login-report',
  templateUrl: './loginreport.component.html'
})
export class LoginReportComponent implements OnInit {
  projects;list;  formGroup; isSubmitted;

  displayedColumns = ['fullName', 'emailId','phoneNumber','selectedProject','roleDescription','loginCount','lastLogin'];

  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  @ViewChild('allSelected') private allSelected: MatOption;
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

  constructor(private projectService:ProjectService,private formBuilder: FormBuilder,
    private router:Router,    private adminreport:AdminReportService){
    this.formGroup = this.formBuilder.group({
      selectedProject: [],
      selected: {
          startDate: moment().subtract(29, 'days').set({ hours: 0, minutes: 0 }),
          endDate: moment().subtract(0, 'days').set({ hours: 23, minutes: 59 }),
      }
    });
  }
  ngOnInit(): void {
    this.getProjects();
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

   downloadPdf() {
    var prepare=[];

    this.list.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.fullName);
      tempObj.push('');
      tempObj.push(e.emailId);
      tempObj.push('');
      tempObj.push( e.phoneNumber);
      tempObj.push('');
      tempObj.push( e.selectedProject);
      tempObj.push('');
      tempObj.push( e.roleDescription);
      tempObj.push('');
      tempObj.push( e.loginCount);
      tempObj.push('');
      tempObj.push(e.lastLogin);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('p', 'mm', [500, 480]);
    autoTable(doc, {
        head: [['Name','', 'Email','','Mobile Number','','Projects','','Role','','Number of logins','','Last login']],
        body: prepare
      });
    doc.save('login_report' + '.pdf');
  }

  ExportTOExcel()
  {

    //let headers = ['Name', 'Email','Mobile Number','Projects','Role','Report To'];
    let data  = this.dataSource.data.map((x:any) =>({
      'Name': x.fullName,
      'Email':x.emailId,
      'Mobile Number':x.phoneNumber,
      'Project':x.selectedProject,
      'Role':x.roleDescription,
      'Number of Logins':x.loginCount,
      'Last Login':x.lastLogin
    }));

    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Login Report');

    /* save to file */
    XLSX.writeFile(wb, 'loginreport.xlsx');

  }

   onGenerate(){
     this.isSubmitted = true;
     if(this.formGroup.value.selectedProject){
      this.formGroup.value.selectedProject = this.formGroup.value.selectedProject.join();
     }
    this.adminreport.generateLoginReport(this.formGroup.value).subscribe(
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
