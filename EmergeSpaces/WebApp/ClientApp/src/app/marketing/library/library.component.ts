import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { NotificationService } from "../../NotificationService";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html'
})

export class LibraryComponent implements OnInit {
  message = "";isSubmitted;
    duplicateLead;
    librarylist:any;

    displayedColumns = ['name', 'size','extension','createdBy','createdDate','action'];
    @ViewChild('fileInput') fileInput;
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    projectId;

    constructor(private service: MarketingService,private dialog:MatDialog,
        private messageService:NotificationService
        ) {

    }
  ngOnInit(): void {
    this.projectId = localStorage.getItem('projectId');
    this.getLibraries();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  getLibraries(){
    this.service.getLibraries(this.projectId).subscribe(res =>{
      this.librarylist = res;
      this.dataSource = new MatTableDataSource<any>(this.librarylist);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onDeleteLibrary(id){

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

        this.service.deleteLibrary(id).subscribe(res=>{
          this.messageService.success("Deleted successfully.");
          this.getLibraries();
        });

        }
    });

  }
  handleFileInput(files){
      if(this.fileInput.nativeElement.files.length <= 0){
           this.messageService.warn('Please select file to import.');
          return;
      }
      this.isSubmitted = true;
      let formData = new FormData();
      formData.append('upload', this.fileInput.nativeElement.files[0])
      formData.append('projectId',localStorage.getItem('projectId'));
      this.service.uploadDocument(formData).subscribe(res => {
        this.isSubmitted = false;
        let result:any = res;
        if(result.message == "success"){
          this.messageService.success("File uploaded successfully.");
          this.getLibraries();
        }else{
          this.messageService.warn("Error occured while uploading.");
        }
        this.fileInput.nativeElement.value = "";
        //this.closeModal();
      },
       error => {
        console.log(error);
      });

  }
  openFileUpload(event:any){
      event.preventDefault();
      let element:HTMLElement = document.getElementById('fileInput') as HTMLElement;
      element.click();
  }
}
