import { OnInit, Component, Inject } from "@angular/core";
import { ProjectService } from "../../../admin/project/project.service";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../../NotificationService";

@Component({
    selector: 'fb_sync',
    templateUrl: './facebook-sync-modal.component.html'
  })
  export class FacebookSyncModalComponent implements OnInit {
    projectId;projectList;
    constructor(private projectService: ProjectService,public ref: MatDialogRef<FacebookSyncModalComponent>, 
        private messageService:NotificationService){

    }

    ngOnInit(): void {
        this.getProjects();
    }

    getProjects() {
        this.projectService.getAllProject().subscribe(res  => {
            this.projectList = res;      
        },
        error => {
            console.log(error);
        });
    }

    onClose(){
        this.ref.close();
    }

    onSave(){
        if(this.projectId == '' || this.projectId == undefined){
            this.messageService.warn('Please select project');
            return false;
        }
        this.ref.close(this.projectId); 
    }
  }