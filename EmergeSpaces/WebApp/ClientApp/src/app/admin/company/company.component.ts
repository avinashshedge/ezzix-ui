import { Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompanyService } from './company.service';
import { UserService } from '../user/user.service';
import { ICompany } from './company.model';

@Component({
  selector: 'company-details',
  templateUrl: './company.component.html',

})
export class CompanyComponent implements OnInit {
  public submitted = false;
  public company: any;
  public id: any;

  public countryList: any;
  public stateList: any;

  companyModel = {} as ICompany;
  public companyForm: FormGroup;

  constructor(private _service: CompanyService,private _adminService: UserService) { }

  ngOnInit() {
    this.countryList = this.getCountries();
    this.id = localStorage.getItem("companyId");
    if (this.id != null || this.id != undefined) {
      this._service.getCompany(this.id).subscribe((company: ICompany) => {
        this.companyModel = company;
        this.getStatesByCountry(this.companyModel.countryId);
      });
    }

  }

  getCountries() {
    this._adminService.getAllCountries().subscribe(res => {
      this.countryList = res;
    },
    error => {
      console.log(error);
    });
  }

  
  getStatesByCountry(countryId) {
    this._adminService.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
    error => {
      console.log(error);
    });
  }  
}

