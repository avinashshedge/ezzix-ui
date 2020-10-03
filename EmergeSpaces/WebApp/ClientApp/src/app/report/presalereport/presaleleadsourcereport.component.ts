import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import { ProjectService } from "../../admin/project/project.service";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import * as moment from "moment";
import { PresaleReportService } from "./presalereport.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";
import { UserService } from "../../admin/user/user.service";


@Component({
  selector: 'presale-lead-source-report',
  templateUrl: './presaleleadsourcereport.component.html'
})
export class PresaleLeadSourceReportComponent implements OnInit {
  projects;list; users;
   formGroup; isSubmitted;
  @ViewChild('TABLE') table: ElementRef;

  displayedColumns = ['leadOwner', 'projectName',
                      'freshLeadCount','hotLeadCount','warmLeadCount',
                      'coldLeadCount','deadLeadCount','assignedLeadCount'];
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
    private router:Router,    private presalereport:PresaleReportService){
    this.formGroup = this.formBuilder.group({
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
    this.getPresaleOwner();
  }


  getPresaleOwner(){
    this.userService.getAllUsers().subscribe(res=>{
      this.users = res;
      this.users =this.users.filter(i => i.roleId == 3)
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
      tempObj.push(e.leadOwner);
      tempObj.push('');
      tempObj.push(e.projectName);
      tempObj.push('');
      tempObj.push( e.freshLeadCount);
      tempObj.push('');
      tempObj.push( e.hotLeadCount);
      tempObj.push('');
      tempObj.push( e.warmLeadCount);
      tempObj.push('');
      tempObj.push(e.coldLeadCount);
      tempObj.push('');
      tempObj.push(e.deadLeadCount);
      tempObj.push('');
      tempObj.push(e.assignedLeadCount);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    autoTable(doc, {
        head: [['Lead Owner','', 'Project','','Fresh Lead','','Hot Lead','','Warm Lead','','Cold Lead','','Dead Lead','','Assigned Lead']],
        body: prepare
      });
    doc.save('lead_count_report' + '.pdf');
  }

  ExportTOExcel()
  {
    //let headers = ['Name', 'Email','Mobile Number','Projects','Role','Report To'];
    let data  = this.dataSource.data.map((x:any) =>({
      'Lead Owner': x.leadOwner,
      'Project':x.projectName,
      'Fresh Lead':x.freshLeadCount,
      'Hot Lead':x.hotLeadCount,
      'Warm Lead':x.warmLeadCount,
      'Cold Lead':x.coldLeadCount,
      'Dead Lead':x.deadLeadCount,
      'Assigned Lead':x.assignedLeadCount
    }));

    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Count Report');

    /* save to file */
    XLSX.writeFile(wb, 'lead_count_report.xlsx');

  }

   onGenerate(){
     this.isSubmitted = true;
     if(this.formGroup.value.selectedProject){
      this.formGroup.value.selectedProject = this.formGroup.value.selectedProject.join();
     }
     if(this.formGroup.value.selectedUser){
      this.formGroup.value.selectedUsers = this.formGroup.value.selectedUser.join();
     }
    this.presalereport.generateLeadCountReport(this.formGroup.value).subscribe(
      res=>
      {
        debugger;
        this.isSubmitted = false;
        this.list = res;
        this.dataSource = new MatTableDataSource<any>(this.list);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
     },err =>{
       debugger;
      this.isSubmitted = false;
     }
     )
  }
  onBack(){
    this.router.navigate(['/reports']);
  }
}
