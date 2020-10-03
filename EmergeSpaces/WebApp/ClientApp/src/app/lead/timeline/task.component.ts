import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../lead.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
  leadId;
  taskForm: FormGroup;
  submitted = false;
  minDate: Date = new Date();

  constructor(private service: LeadService, private messageService: NotificationService,
    public dialogRef: MatDialogRef<TaskComponent>,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.initTaskForm();
  }

  get f() { return this.taskForm.controls; }

  ngOnInit() {
    this.leadId = this.data.leadId;
  }

  initTaskForm(){
    this.taskForm = this.fb.group({
      id: [0],
      tasktype: [null, Validators.required],
      subject: [null, Validators.required],
      scheduleFrom: [null, Validators.required],
      scheduleFromTime:['10:00 am'],
      description: [],
      reminder:[]
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    this.taskForm.value.scheduleFrom =this.setDate(this.taskForm.value.scheduleFrom,this.taskForm.value.scheduleFromTime);

    this.taskForm.value.leadId = this.leadId;
    this.taskForm.value.status = "inprogress";
    this.service.saveTask(this.taskForm.value).subscribe(res => {
      this.messageService.success('Task submitted');
      this.dialogRef.close();
    },
      error => {
        console.log(error);
      });
  }

  onClose(){
    this.dialogRef.close();
  }

  setDate(d,s){
    var parts = s.match(/(\d+)\:(\d+) (\w+)/),
    hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
    minutes = parseInt(parts[2], 10);

    d.setHours(hours);
    d.setMinutes(minutes);

    return new Date(d).toLocaleString();
  }

}
