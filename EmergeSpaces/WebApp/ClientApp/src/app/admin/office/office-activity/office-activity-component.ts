import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfficeService } from '../office.service';
import { Office } from '../office-model';
import { UserService } from '../../user/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../NotificationService';
@Component({
  selector: 'office-activity',
  templateUrl: './Office-Activity-Component.html',
})

export class OfficeActivityComponent implements OnInit {
  public submitted = false;
  public officeId: any;
  public dissableFlag: boolean;
  public countryList: any;
  public stateList: any;
  public companyId: any;
  public officeForm : FormGroup;
  officeModel:any = new Office('',0,'',0, 0, '', '', 0,'');
  
  
  constructor(private _service: OfficeService, private _route: Router,private userService: UserService,
    private fb: FormBuilder,private diaglogRef : MatDialogRef<OfficeActivityComponent>, 
    private notificationService: NotificationService,@Inject(MAT_DIALOG_DATA) public data: any) {
        this.dissableFlag = false;
  }

  ngOnInit() {
    this.countryList = this.getCountries();
    this.initOfficeForm();

    this.companyId = this.data.companyId;
    this.officeId = this.data.officeId;
    if (this.officeId > 0) {
      this._service.getOffice(this.officeId).subscribe((office: Office) => {
        this.officeModel = office;
        this.getStatesByCountry(this.officeModel.countryId);
        this.setOfficeForm(office);
      });
    }

  }

  get f() { return this.officeForm.controls; }

  initOfficeForm(){
      this.officeForm = this.fb.group({
        officeName: [null, Validators.required],
        address: [null],
        countryId: [null],
        stateId: [null],
        city: [null],
        zipCode: [null],
        phoneNo: [null],
        fax: [null]
    });
  }

  setOfficeForm(data){
    this.officeForm = this.fb.group({
      officeName: data.officeName,
      address: data.address,
      countryId: data.countryId,
      stateId: data.stateId,
      city: data.city,
      zipCode: data.zipCode,
      phoneNo: data.phoneNo,
      fax: data.fax
  });
}

  getCountries() {
    this.userService.getAllCountries().subscribe(res => {
      this.countryList = res;
    },
    error => {
      console.log(error);
    });
  }

  onCountryChange(countryId) {
    this.getStatesByCountry(countryId);
  }

  getStatesByCountry(countryId) {
    this.userService.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
    error => {
      console.log(error);
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.officeForm.invalid) {
      return;
    }

    this.officeForm.value.companyId = this.companyId;
    this.officeForm.value.id = this.officeId;

    this.dissableFlag = true;
    if (this.officeId > 0) {
      this._service.editOffice(this.officeForm.value).subscribe(res => {
        setTimeout(() => {
          this.officeForm.reset();
          this.submitted = false;
          this.notificationService.success('Office updated');
          //this.messageService.add({severity:'success', summary: 'Success Message', detail:'Project updated'});
          this.diaglogRef.close();
        }, 1000);
      },
        error => {
          console.log(error);
        });
    }
    else {
      this._service.addOffice(this.officeForm.value).subscribe(res => {
        setTimeout(() => {
          this.officeForm.reset();
          this.submitted = false;
          this.notificationService.success('Office added');
          //this.messageService.add({severity:'success', summary: 'Success Message', detail:'Project updated'});
          this.diaglogRef.close();
        }, 1000);
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
