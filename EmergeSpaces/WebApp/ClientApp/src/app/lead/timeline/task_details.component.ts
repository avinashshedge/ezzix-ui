import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TaskComponent } from './task.component';
import { NotificationService } from '../../NotificationService';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'task_details',
  templateUrl: './task_details.component.html',  
  styleUrls: ['./task_details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  tasks;  leadId;
  inprogresstasks :[];
  completetasks :[];
  duetasks:[];

  constructor(private _service: LeadService,private dialog:MatDialog,private messageService:NotificationService,private activatedRoute: ActivatedRoute) {
    this.tasks = [];
    this.activatedRoute.params.subscribe(params => this.leadId = params['id']);
  }
  
  drop(event: CdkDragDrop<string[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.onCompleteTask(event.previousContainer.data[0]);
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  ngOnInit() {
    this.getTasks();
  }
    
  showTaskModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    //dialogConfig.autoFocus = true;
    dialogConfig.data = {
          leadId:this.leadId
    };

    const ref = this.dialog.open(TaskComponent,dialogConfig); 

    ref.afterClosed().subscribe(result => {
      this.getTasks();
    });
  }

  getTasks() {
    this._service.getAllTask(this.leadId).subscribe(
      res => {
        this.tasks = res;
        
        this.inprogresstasks = this.tasks.filter( i=>i.status == "inprogress" && this.isGreaterDate(i.scheduleFrom) == false);
        this.completetasks = this.tasks.filter( i=>i.status == "complete");
        this.duetasks = this.tasks.filter( i=> this.isGreaterDate(i.scheduleFrom) == true && i.status == "inprogress");
      }
    );
  }
  isGreaterDate(scheduleFrom){
    let today = new Date();
    var scheduleFromDate = new Date(scheduleFrom);
    if(today.getTime() > scheduleFromDate.getTime())
    {
      return true;
    }
    return false;
  }
  onCompleteTask(task) {
    task.leadId = this.leadId;
    task.Status = "complete";
    this._service.updateTask(task).subscribe(res => {
      this.messageService.success('Task completed successfully');     
      //this.getTasks();
    },
    error => {
      console.log(error);
    });
  }

  
}
