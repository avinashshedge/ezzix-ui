import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'modal-template',
    templateUrl: './modal-template.component.html'
})
export class ModalTemplateComponent implements OnInit {
    public templateForm: FormGroup;  
    public name: any;
    public hasError = false; 
    constructor(private dialogRef:MatDialogRef<ModalTemplateComponent>,private fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.templateForm = this.fb.group({
            name: [null, Validators.required]
        });
    }

    onClose(){
       this.dialogRef.close();
    }

    onSave(){
        if (this.templateForm.invalid) {
            return;
          }

        this.dialogRef.close(this.templateForm.value['name']);
    }
}