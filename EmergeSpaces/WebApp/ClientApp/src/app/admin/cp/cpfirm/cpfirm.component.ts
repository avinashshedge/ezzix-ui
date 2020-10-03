import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../NotificationService';
import { CPFirmService } from './cpfirm.service';

@Component({
  selector: 'app-cpfirm',
  templateUrl: './cpfirm.component.html'
})
export class CpfirmComponent implements OnInit {
  firmId;companyId;
  firmForm:FormGroup;countryList;stateList;
  constructor(
    private cpfirmService:CPFirmService,
    private fb:FormBuilder,private userService:UserService,
    private diaglogRef : MatDialogRef<CpfirmComponent>, 
    private notificationService: NotificationService,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initForm();
    this.getCountries();
    this.companyId = this.data.companyId;
    this.firmId = this.data.firmId;
    if (this.firmId > 0) {
      this.cpfirmService.getFirmById(this.firmId).subscribe(res => {
        let firmModel:any = res;
        this.getStatesByCountry(firmModel.countryId);
        this.setFirmForm(firmModel);
      });
    }
  }

  get f() { return this.firmForm.controls; }

  initForm(){
    this.firmForm = this.fb.group({
      firmName: [null, Validators.required],
      ownerName: [null],
      gstNo: [null],
      panNo: [null],
      aadharNo: [null],
      address:[null],
      city:[null],
      stateId:[null],
      countryId:[null],
      zipCode:[null]
    });
  }

  setFirmForm(data){
    this.firmForm = this.fb.group({
      firmName: data.firmName,
      ownerName: data.ownerName,
      gstNo: data.gstno,
      panNo: data.panNo,
      aadharNo: data.aadharNo,
      address:data.address,
      city:data.city,
      stateId:data.stateId,
      countryId:data.countryId,
      zipCode:data.zipCode
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

  onCountryChange() {
    this.getStatesByCountry(this.f.countryId.value);
  }

  getStatesByCountry(countryId) {
    this.userService.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
    error => {
      console.log(error);
    });
  }

  onSubmit(){
    // stop here if form is invalid
    if (this.firmForm.invalid) {
      return;
    }

    this.firmForm.value.companyId = this.companyId;
    this.firmForm.value.id = this.firmId;

    if (this.firmId > 0) {
      this.cpfirmService.updateFirm(this.firmForm.value).subscribe(res => {
        setTimeout(() => {
          this.firmForm.reset();
          this.notificationService.success('Firm updated');
          this.diaglogRef.close();
        }, 500);
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.cpfirmService.addFirm(this.firmForm.value).subscribe(res => {
        setTimeout(() => {
          this.firmForm.reset();
          this.notificationService.success('Firm added');
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