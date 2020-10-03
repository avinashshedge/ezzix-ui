import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProjectService } from '../../admin/project/project.service';
import { NotificationService } from '../../NotificationService';
import { UserService } from '../../admin/user/user.service';

@Component({
  selector: 'lead_details',
  templateUrl: './lead_details.component.html'
})
export class LeadDetailsComponent implements OnInit {

  leadId;
  submitted = true;
  leaddetail : any;
  public leaddetailsForm: FormGroup;
  public maritalstatuses: any;
  public countryList: any;
  public stateList: any;
  public purchasetypes: any;
  public propertytypes: any;
  public interiortypes: any;
  public hometypes: any;
  public occupations: any;
  public industries = [] as any;
  public budgetRange: any;
  public projectTypes:any;
  public selectedProject = [];
  public projects: any;
  public leadSources: any;
  public unitAreas:any;
  public purchaseTimeframes:any;

  constructor(private _service: LeadService, private _projectService: ProjectService,     private adminService: UserService,
     private messageService: NotificationService,
     private activatedRoute: ActivatedRoute, private fb: FormBuilder) {

    this.activatedRoute.params.subscribe(params => this.leadId = params['id']);
    this.purchaseTimeframes = [{ 'key': 'immediate', 'value': 'Immediate'},{ 'key': '1-6 months', 'value': '1-6 Months' },{ 'key': '6 -12 months', 'value': '6 -12 Months' },{ 'key': 'more than 12 months', 'value': 'More than 12 months' }];

    this.unitAreas = [{ 'key': '500-1000', 'value': '500-1000' },    { 'key': '1000-1500', 'value': '1000-1500' },{ 'key': '3000-3500', 'value': '3000-3500' },{ 'key': '3500+', 'value': '3500+' }];
    this.occupations = [{ 'key': 'self-employed', 'value': 'Self Employed' },{ 'key': 'salaried', 'value': 'Salaried' }, { 'key': 'housewife', 'value': 'Housewife' }, { 'key': 'retired', 'value': 'Retired' }, { 'key': 'other', 'value': 'Other' }];
    this.projectTypes = [{ 'key': 'residential', 'value': 'Residential' },{ 'key': 'commercial', 'value': 'Commercial' },{ 'key': 'sez', 'value': 'SEZ' }];
    this.purchasetypes = [{ 'key': 'Purchase', 'value': 'Purchase' }, { 'key': 'Rent', 'value': 'Rent' }];
    this.propertytypes = [{ 'key': '1rk', 'value': '1 RK' }, { 'key': '1bhk', 'value': '1 BHK' },
     { 'key': '1.5bhk', 'value': '1.5 BHK' }, { 'key': '2bhk', 'value': '2 BHK' },
     { 'key': '3bhk', 'value': '3 BHK' }, { 'key': 'duplex', 'value': 'Duplex' },
     { 'key': 'penthouse', 'value': 'Penthouse' },
    { 'key': 'villa', 'value': 'Villa' },
    { 'key': 'studio apartment', 'value': 'Studio Apartment' },
     { 'key': 'gardenhomes', 'value': 'Garden Homes' }, { 'key': 'other', 'value': 'Other' }];
    this.maritalstatuses = [{ 'key': 'Single', 'value': 'Single' }, { 'key': 'Married', 'value': 'Married' }];
    this.getBudgetRange();
    this.hometypes = [{ 'key': 'Apartment', 'value': 'Apartment' }, { 'key': 'Villa', 'value': 'Villa' }, { 'key': 'Independent', 'value': 'Independent' }];

    this.initForm();
    this.getCountries();
    this.getIndustries();
    this.projects = this.getProjects();

  }

  initForm() {
    this.leaddetailsForm = this.fb.group({
      firstName: [null, Validators.required],
      primaryMobile: [null, [Validators.required, this.phoneNumberValidator, Validators.minLength(10)]],
      lastName: [null],
      secondaryMobile: [null],
      emailId: [null, [Validators.required, Validators.email]],
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
      homeType: [null],
      purchaseType: [null],
      propertyType: [null],
      preferredLocation: [null],
      selectedProject: [null,Validators.required],
      unitArea: [null],
      budget: [null],
      purchaseTimeframe:[null]
    });
  }

  get f() { return this.leaddetailsForm.controls; }

  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }

  getBudgetRange(){
    this._service.getBudgetRange().subscribe(res => {
      this.budgetRange = res;
    },
      error => {
        console.log(error);
      });
  }

  getProjects() {
    this._projectService.getAllProject().subscribe(res => {
      this.projects = res;
      //this.initForm();
      this.getLeadDetails();
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

  getCountries() {
    this.adminService.getAllCountries().subscribe(res => {
      this.countryList = res;
    },
      error => {
        console.log(error);
      });
  }

  onCountryChange() {
    var countryId = this.f.countryId;
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

  getLeadDetails() {
    this._service.getLeadDetails(this.leadId).subscribe(
      res => {
        this.leaddetail = res;
       this.setLeadDetailForm(res);
      }
    );
  }

  setLeadDetailForm(data) {
    this.getStatesByCountry(data.permenantCountryId);
    this.setProjects(data);
  }

  setProjects(data) {
    // if(data.interestedProject != null && data.interestedProject != ""){
    //     let projectIds: [] = data.interestedProject.split(",");
    //     var self = this;
    //     projectIds.forEach(function (item) {
    //       self.selectedProject.push(self.projects.filter(i => i.id == item)[0]);
    //     });
    // }


    this.selectedProject = data.interestedProject;//.split(',').map(Number);
    if (this.leaddetailsForm) {
      this.leaddetailsForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        primaryMobile: data.primaryMobile,
        secondaryMobile: data.secondaryMobile,
        emailId: data.emailId,
        alternateEmailId: data.alternateEmailId,
        //residentialAddress: data.residentialAddress,
        //residentialCity: data.residentialCity,
        //residentialState: data.residentialState,
        //residentialCountry: data.residentialCountry,
        //residentialZipCode: data.residentialZipCode,
        permenantAddress: data.permenantAddress,
        permenantCity: data.permenantCity,
        permenantStateId: data.permenantStateId,
        permenantCountryId: data.permenantCountryId,
        permenantZipCode: data.permenantZipCode,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        organization: data.organization,
        industry: data.industry,
        designation: data.designation,
        companyAddress: data.companyAddress,
        companyWebsite: data.companyWebsite,
        possesionTime: data.possesionTime,
        homeType: data.homeType,
        purchaseType: data.purchaseType,
        propertyType: data.propertyType,
        preferredLocation: data.preferredLocation,
        selectedProject: this.selectedProject,
        unitArea: data.unitArea,
        budget: data.budget,
        purchaseTimeframe:data.purchaseTimeframe
      });
    }
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.leaddetailsForm.invalid) {
      return;
    }
    this.leaddetailsForm.value.id = this.leadId;
    this.leaddetailsForm.value.interestedProject = this.leaddetailsForm.value.selectedProject;


    this._service.saveLead(this.leaddetailsForm.value).subscribe(res => {
      this.messageService.success('Lead details saved successfully');
    },
    error => {
      console.log(error);
    });

  }
}
