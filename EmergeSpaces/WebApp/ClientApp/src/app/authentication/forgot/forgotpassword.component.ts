import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../login/login.service';


@Component({
  selector: 'forgot-password',
  templateUrl: './forgotpassword.component.html'
})

export class ForgotPasswordComponent implements OnInit {
  public passwordform: FormGroup;
  submitted = false;
  hasError = false;
  errorMessage;
  
  constructor(private _service: LoginService, public messageService :NotificationService,
    public ref: MatDialogRef<ForgotPasswordComponent>, private fb: FormBuilder) {

    this.passwordform = this.fb.group({
        email: [null, [Validators.required, Validators.email]]
    });
  }

 // convenience getter for easy access to form fields
  get f() { return this.passwordform.controls; }
   
  ngOnInit() {
   }

  
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordform.invalid) {
      return;
    }
    this._service.forgotpassword(this.passwordform.value).subscribe(res => {
      this.hasError = false;
      this.messageService.success('Password send');
      this.closeModal();
    },
    error => { 
      this.hasError = true;
      this.errorMessage = error;
    });

  }

  closeModal(){
    this.ref.close();
  }
  
}
