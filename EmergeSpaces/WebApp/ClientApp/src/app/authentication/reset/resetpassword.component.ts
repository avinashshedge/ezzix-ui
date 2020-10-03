import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../NotificationService';
import { CustomValidators } from 'ngx-custom-validators';
import { LoginService } from '../login/login.service';

const newpassword = new FormControl('', Validators.required);
const confirmPassword = new FormControl('');

@Component({
  selector: 'reset-password',
  templateUrl: './resetpassword.component.html'
})

export class ResetPasswordComponent implements OnInit {
  public resetForm: FormGroup;
  submitted = false;
  hasError = false;
  errorMessage;

  constructor(private _service: LoginService, public messageService :NotificationService,
    public ref: MatDialogRef<ResetPasswordComponent>, private fb: FormBuilder) {

    this.resetForm = this.fb.group({
        oldpassword: [null, [Validators.required]],
        newpassword: newpassword,
        confirmpassword: confirmPassword
    });
  }


 // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  ngOnInit() {
   }

   checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('newpassword').value;
    let confirmPass = group.get('confirmpassword').value;

    return pass === confirmPass ? null : { notSame: true }
    }

  onReset() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this._service.resetpassword(this.resetForm.value).subscribe(res => {
      this.messageService.success('Password reset successfully');
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
