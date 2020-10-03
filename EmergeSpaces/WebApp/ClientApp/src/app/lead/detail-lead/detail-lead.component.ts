import { Component, OnInit, ViewChild } from '@angular/core';
import { LeadService } from '../lead.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProjectService } from '../../admin/project/project.service';
import { UserService } from '../../admin/user/user.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef } from '@angular/material/dialog';
import { MarketingService } from '../../marketing/marketing.service';
import { Observable, combineLatest } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-detail-lead',
  templateUrl: './detail-lead.component.html'
})
export class DetailLeadComponent implements OnInit {

  leadId = 0;
  submitted = false;
  leaddetail: any;
  public detailLeadForm: FormGroup;
  public maritalstatuses: any;
  public countryList: any;
  public stateList: any;
  public purchasetypes: any;
  public propertytypes: any;
  public occupations: any;
  public industries = [] as any;
  public budgetRange: any;
  public projectTypes:any;
  public selectedProject = [];
  public projects: any;
  public leadSources: any;
  public unitAreas:any;purchaseTimeframes:any;
  leadSubSource;
  constructor(private _service: LeadService, private _projectService: ProjectService,
    private marketingService:MarketingService,
    private adminService: UserService,public messageService :NotificationService,
     private fb: FormBuilder,private diaglogRef : MatDialogRef<DetailLeadComponent>) {

    this.initForm();
    this.getCountries();
    this.getIndustries();
    this.purchaseTimeframes = [{ 'key': 'immediate', 'value': 'Immediate'},{ 'key': '1-6 months', 'value': '1-6 Months' },{ 'key': '6 -12 months', 'value': '6 -12 Months' },{ 'key': 'more than 12 months', 'value': 'More than 12 months' }];

    this.unitAreas = [{ 'key': '500-1000', 'value': '500-1000' },    { 'key': '1000-1500', 'value': '1000-1500' },{ 'key': '3000-3500', 'value': '3000-3500' },{ 'key': '3500+', 'value': '3500+' }];
    this.occupations = [{ 'key': 'self-employed', 'value': 'Self Employed' },
    { 'key': 'salaried', 'value': 'Salaried' },
    { 'key': 'housewife', 'value': 'Housewife' },
    { 'key': 'retired', 'value': 'Retired' },
    { 'key': 'other', 'value': 'Other' }];
    this.projectTypes = [{ 'key': 'residential', 'value': 'Residential' },{ 'key': 'commercial', 'value': 'Commercial' },{ 'key': 'sez', 'value': 'SEZ' }];
    this.purchasetypes = [{ 'key': 'Purchase', 'value': 'Purchase' }, { 'key': 'Rent', 'value': 'Rent' }];
    this.propertytypes = [{ 'key': '1rk', 'value': '1 RK' },
    { 'key': '1bhk', 'value': '1 BHK' }, { 'key': '1.5bhk', 'value': '1.5 BHK' },
    { 'key': '2bhk', 'value': '2 BHK' }, { 'key': '3bhk', 'value': '3 BHK' },
    { 'key': 'duplex', 'value': 'Duplex' },
    { 'key': 'penthouse', 'value': 'Penthouse' },
    { 'key': 'villa', 'value': 'Villa' },
    { 'key': 'studio apartment', 'value': 'Studio Apartment' },
    { 'key': 'gardenhomes', 'value': 'Garden Homes' },
    { 'key': 'other', 'value': 'Other' }];
    this.maritalstatuses = [{ 'key': 'Single', 'value': 'Single' }, { 'key': 'Married', 'value': 'Married' }];
    this.getBudgetRange();
    this.leadSources = this.getLeadSources();
    this.projects = this.getProjects();
  }

  initForm() {
    this.detailLeadForm = this.fb.group({
      firstName: [null, Validators.required],
      primaryMobile: [null, [Validators.required,
                      this.phoneNumberValidator,
                      Validators.minLength(10)],
                      this.validateNumberViaServer.bind(this)],
      lastName: [null],
      emailId: [null, [Validators.required, Validators.email],
              this.validateEmailViaServer.bind(this)],
      secondaryMobile: [null],
      alternateEmailId: [null],
      //residentialAddress: [null],
      //residentialCity: [null],
      //residentialState: [null],
      //residentialCountry: [null],
      //residentialZipCode: [null],
      permenantAddress: [null],
      permenantCity: [null],
      permenantStateId: [null],
      permenantCountryId: [null],
      permenantZipCode: [null],
      maritalStatus: [null],
      occupation: [null],
      organization: [null],
      industry: [null],
      designation: [null],
      companyAddress: [null],
      companyWebsite: [null],
      possesionTime: [null],
      purchaseType: [null],
      propertyType: [null],
      preferredLocation: [null],
      selectedProject: [null],
      unitArea: [null],
      purchaseTimeframe:[null],
      budget: [null],
      leadSource: [null, [Validators.required]],
      leadSubSource:[null]
    });
  }

  get f() { return this.detailLeadForm.controls; }

  validateNumberViaServer({value}: AbstractControl): Observable <ValidationErrors | null> {
    const validations: Observable<boolean>[] = [];
      const numberExists$: Observable<boolean> = this._service.validateLeadMobileNumber(value);
      validations.push(numberExists$);
      return combineLatest(validations)
          .pipe(debounceTime(500), map(([numberExists]) => {
              if (numberExists) {
                  return {
                      isNumberExists: true
                  };
              }
              return null;
          }));
}

validateEmailViaServer({value}: AbstractControl): Observable <ValidationErrors | null> {
  const validations: Observable<boolean>[] = [];
    const emailExists$: Observable<boolean> = this._service.validateLeadEmail(value);
    validations.push(emailExists$);
    return combineLatest(validations)
        .pipe(debounceTime(500), map(([emailExists]) => {
            if (emailExists) {
                return {
                    isEmailExists: true
                };
            }
            return null;
        }));
}
  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }

  getLeadSources(){
    this._service.getLeadSources().subscribe(res => {
      this.leadSources = res;
    },
      error => {
        console.log(error);
      });
  }
  getProjects() {
    this._projectService.getAllProject().subscribe(res => {
      this.projects = res;
    },
      error => {
        console.log(error);
      });
  }

  getIndustries() {

    let industriesString = "Advertising, Agriculture, Automobile, Bio Technology, Banking, Consulting, Dealership, Entertainment, Energy, F & B, Finance, Government, Hospital, Infrastruture, IT, Insurance, Law firm, Logistics, Medical, Manufacturing, Pharmaceuticals, Real Estate, Retail, Telecom, Trading, Other";
    var indus = industriesString.split(",");
    for (var i = 0; i < indus.length; i++) {
      var data = { key: '', value: '' };
      data.key = indus[i];
      data.value = indus[i];
      this.industries.push(data);
    }
  }

  ngOnInit() {
  }

  getBudgetRange(){
    this._service.getBudgetRange().subscribe(res => {
      this.budgetRange = res;
    },
      error => {
        console.log(error);
      });
  }

  onLeadSourceChange(){
    var leadSourceId = this.f.leadSource.value;
    this.marketingService.getLeadSubSourcesBySource(leadSourceId).subscribe(res => {
      this.leadSubSource = res;
    },
    error => {
      console.log(error);
    });
  }

  getCountries() {
    this.adminService.getAllCountries().subscribe(res => {
      this.countryList = res;
    },
      error => {
        console.log(error);
      });
  }

  onCountryChange() {
    var countryId = this.f.countryId.value;
    this.getStatesByCountry(countryId);
  }

  getStatesByCountry(countryId) {
    this.adminService.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
      error => {
        console.log(error);
      });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.detailLeadForm.invalid) {
      return;
    }

    this.detailLeadForm.value.id = this.leadId;
    if(this.detailLeadForm.value.selectedProject != null){
      this.detailLeadForm.value.interestedProject = this.detailLeadForm.value.selectedProject;
    }
    if(this.detailLeadForm.value.possesionTime){
      this.detailLeadForm.value.possesionTime = new Date(this.detailLeadForm.value.possesionTime.year,
        this.detailLeadForm.value.possesionTime.month, this.detailLeadForm.value.possesionTime.day,12,0,0);
    }
    this._service.addNewLead(this.detailLeadForm.value).subscribe(res => {
      this.messageService.success('Lead added successfully');
      this.onClose();
    },
    error => {
      console.log(error);
    });

  }

  onClose(){
    this.diaglogRef.close();
  }

}
