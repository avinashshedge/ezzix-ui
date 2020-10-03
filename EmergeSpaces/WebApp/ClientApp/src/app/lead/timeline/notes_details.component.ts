import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NotesComponent } from './notes.component';

@Component({
  selector: 'notes_details',
  templateUrl: './notes_details.component.html'
})
export class NotesDetailsComponent implements OnInit {
  notes;
  leadId;
  constructor(private _service: LeadService,private activatedRoute: ActivatedRoute,private dialog:MatDialog) {
    this.notes = [];
    this.activatedRoute.params.subscribe(params => this.leadId = params['id']);
  }
  
  ngOnInit() {
    this.getNotes();
  }

  showNotesModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    //dialogConfig.autoFocus = true;
    dialogConfig.data = {
          leadId:this.leadId
    };

    const ref = this.dialog.open(NotesComponent,dialogConfig); 

    ref.afterClosed().subscribe(result => {
      this.getNotes();
    });
  }

  getNotes() {
    this._service.getAllNotes(this.leadId).subscribe(
      res => {        
        this.notes = res;
      }
    );
  }

}
