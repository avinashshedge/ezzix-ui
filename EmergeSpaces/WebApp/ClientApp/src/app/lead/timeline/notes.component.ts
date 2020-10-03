import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../lead.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'activity_notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
  notesForm: FormGroup;  leadId;  submitted;
  constructor(private service: LeadService, private messageService: NotificationService,
    private diaglogRef : MatDialogRef<NotesComponent>,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initNotesForm();
  }

  get f() { return this.notesForm.controls; }

  ngOnInit() {
    this.leadId = this.data.leadId;
  }

  initNotesForm(){
    this.notesForm = this.fb.group({
      id: [0],
      description: [null,Validators.required]
    });
  }

  
  onClose(){
    this.diaglogRef.close();
  }

  onSave() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.notesForm.invalid) {
      return;
    }

    this.notesForm.value.leadId = this.leadId;
    this.service.saveNotes(this.notesForm.value).subscribe(res => {
      this.messageService.success('Note added');
      this.diaglogRef.close();      
    },
    error => {
        console.log(error);
    });
  }
  
}