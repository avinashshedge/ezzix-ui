import { OnInit, Component, ViewChild } from "@angular/core";
import { MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../NotificationService";
import { UserService } from "../user/user.service";

@Component({
    selector: 'select-user',
    templateUrl: './select-user.component.html'
})
  
export class SelectUserComponent implements OnInit {

    userList:any = []; selectedUsers:any;
    constructor(public ref: MatDialogRef<SelectUserComponent>,
        private service: UserService,public messageService :NotificationService){
    }
 
    ngOnInit(): void {
        this.getUserList();
    }

    getUserList(){
        this.service.getAllUsers().subscribe(res =>{
            this.userList = res;
        });
    }
    onSave(){
        this.ref.close(this.selectedUsers);
    }
    onClose(){
        this.ref.close();
    }
}