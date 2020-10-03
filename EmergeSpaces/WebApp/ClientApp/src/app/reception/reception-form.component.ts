import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ReceptionService } from './reception.service';
import { LeadService } from '../lead/lead.service';
import { NotificationService } from '../NotificationService';
import { UserService } from '../admin/user/user.service';
import { ProjectService } from '../admin/project/project.service';
import { MarketingService } from '../marketing/marketing.service';

@Component({
  selector: 'reception-form',
  templateUrl: './reception-form.component.html'
})

export class ReceptionFormComponent implements OnInit {

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
  public unitAreas:any;purchaseTimeframes:any;salesUser:any;
  form:FormGroup;leadSubSource;

  constructor(private _service: LeadService, private _projectService: ProjectService,
    private marketingService:MarketingService,
    private adminService: UserService,public messageService :NotificationService,private fb:FormBuilder,private service:ReceptionService) { }

  ngOnInit(): void {
    this.initForm();

    this.getLeadSources();
    this.getProjects();

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
  }

  initForm() {
    this.form = this.fb.group({
      firstName: [null, Validators.required],
      primaryMobile: [null, [Validators.required, this.phoneNumberValidator, Validators.minLength(10)]],
      lastName: [null],
      secondaryMobile: [null],
      emailId: [null, [Validators.required, Validators.email]],
      alternateEmailId: [null],
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
      leadOwner: [null],
      unitArea: [null],
      purchaseTimeframe:[null],
      budget: [null],
      selectedProject:[null],
      leadSource: [null],
      leadSubSource:[null],
      employeeName:[null]
    });
  }

  getSalesUser(projectId){
    this.service.getSalesUser(projectId).subscribe(res => {
      this.salesUser = res;
    },
    error => {
      console.log(error);
    });
  }

  get f() { return this.form.controls; }

  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }
  onProjectChange(){
    debugger;
    var projectId = this.f.selectedProject.value;
    this.getSalesUser(projectId);
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

  getBudgetRange(){
    this._service.getBudgetRange().subscribe(res => {
      this.budgetRange = res;
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
    var countryId = this.f.permenantCountryId.value;
    this.getStatesByCountry(countryId);
  }

  onLeadSourceChange(){
    let leadSourceId = this.f.leadSource.value;
    if(leadSourceId ==19){
      this.f.leadSubSource.setValue('');
    }
    if(leadSourceId == 18){
      this.service.getCustomerList().subscribe(res => {
        this.leadSubSource = res;
      },
      error => {
        console.log(error);
      });
    }else{
      this.marketingService.getLeadSubSourcesBySource(leadSourceId).subscribe(res => {
        this.leadSubSource = res;
      },
      error => {
        console.log(error);
      });
    }

  }

  getStatesByCountry(countryId) {
    this.adminService.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
      error => {
        console.log(error);
      });
  }


  onSubmit(){
    if (this.form.invalid) {
      return;
    }

    if(this.form.value.selectedProject != null){
      this.form.value.interestedProject = this.form.value.selectedProject;
    }
    if(this.form.value.possesionTime){
      this.form.value.possesionTime = new Date(this.form.value.possesionTime.year,
        this.form.value.possesionTime.month, this.form.value.possesionTime.day,12,0,0);
    }

    this.service.addNewLead(this.form.value).subscribe(res => {
      this.messageService.success('Lead added successfully');
      this.onClose();
    },
    error => {
      this.onClose();
    });


  }

  onClose(){
    this.form.reset();
  }



}
