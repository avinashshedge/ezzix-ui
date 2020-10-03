import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CPUserService } from './cpuser.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../NotificationService';
import { CPFirmService } from '../cpfirm/cpfirm.service';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-cpuser',
  templateUrl: './cpuser.component.html'
})
export class CpuserComponent implements OnInit {

  userId; companyId;   cpUserForm:FormGroup;
  firmList;
  constructor(private cpservice:CPFirmService,
    private cpUserService:CPUserService,private fb:FormBuilder,
    private diaglogRef : MatDialogRef<CpuserComponent>,
    private notificationService: NotificationService,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getFirmList();
    this.initForm();
    this.companyId = this.data.companyId;
    this.userId = this.data.userId;
    if (this.userId > 0) {
      this.cpUserService.getCPUserById(this.userId).subscribe(res => {
        let userModel:any = res;
        this.setCPUserForm(userModel);
      });
    }
  }

  getFirmList(){
    this.cpservice.getAllFirms().subscribe(res => {
      this.firmList = res;
    });
  }
  get f() { return this.cpUserForm.controls; }

  initForm(){
    this.cpUserForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null],
      emailId: [null,[Validators.required, CustomValidators.email]],
      mobileNo: [null,[Validators.required, this.phoneNumberValidator, Validators.minLength(10)]],
      firmId: [null,Validators.required],
      dob:[null],
      gender:['male']
    });
  }

  setCPUserForm(data){
    this.cpUserForm = this.fb.group({
      firmId:data.firmId,
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      mobileNo: data.mobileNo,
      dob: data.dob,
      gender:data.gender
    });
  }

  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid ? null : { invalidNumber: { valid: false, value: control.value } }
  }


  onSubmit(){
    // stop here if form is invalid
    if (this.cpUserForm.invalid) {
      return;
    }

    this.cpUserForm.value.companyId = this.companyId;
    this.cpUserForm.value.id = this.userId;

    if (this.userId > 0) {
      this.cpUserService.updateCpUser(this.cpUserForm.value).subscribe(res => {
        setTimeout(() => {
          this.cpUserForm.reset();
          this.notificationService.success('User updated');
          this.diaglogRef.close();
        }, 500);
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.cpUserService.addUser(this.cpUserForm.value).subscribe(res => {
        setTimeout(() => {
          this.cpUserForm.reset();
          this.notificationService.success('User added');
          this.diaglogRef.close();
        }, 500);
      },
        error => {
          console.log(error);
        });
    }
  }

  onClose() {
    this.diaglogRef.close();
  }
}
