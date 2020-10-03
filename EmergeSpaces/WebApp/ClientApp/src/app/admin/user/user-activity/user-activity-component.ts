import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from '../user-model';
import { UserService } from '../user.service';
import {
  FormBuilder,  FormGroup,  Validators,  FormControl, AbstractControl } from '@angular/forms';
import { CustomValidators  } from 'ngx-custom-validators';
import { NotificationService } from '../../../NotificationService';
import { ProjectService } from '../../project/project.service';
import { OfficeService } from '../../office/office.service';


@Component({
  selector: 'user-activity',
  templateUrl: './User-Activity-Component.html',
})
export class UserActivityComponent implements OnInit {

  public submitted = false;
  public userId: any;
  public userId1: string;
  public group: any;
  public titleList: any;
  public genderList: any;
  public corporatePositions: any;
  public countryList: any;
  public stateList: any;
  public roleList :any = [];
  public companyList : any;
  public projectList: any = [];
  offices: any = [];
  selectedRole :any;
  selectedCompanies : any = [];
  selectedProject:any = [];
  selectedOffice :any = [];
  dropdownSettingsRole = {};
  disableReportTo;

  userModel = {} as IUser;
  public userForm: FormGroup;
  reportToList: any;
  now: Date=new Date();
  companyId:any;

  hasServerError = false; serverError;

  constructor(private _service: UserService,private _projectService:ProjectService,private _officeService:OfficeService,
    private _route: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private notificationService: NotificationService,) {
    this.activatedRoute.params.subscribe(params => this.userId = params['id']);

    this.companyId = localStorage.getItem('companyId');
  }
  get f() { return this.userForm.controls; }


  ngOnInit() {
    this.getRoles();
    this.getCountries();
    this.getProjectsByCompanies();
    this.getOfficesByCompanies();
    this.titleList = [{ 'key': '1', 'value': 'Mr' },
    { 'key': '2', 'value': 'Miss' },
    { 'key': '3', 'value': 'Mrs' },
    { 'key': '4', 'value': 'Dr' },
    { 'key': '5', 'value': 'Ms' },
    { 'key': '6', 'value': 'M/s' }];

    this.genderList = [{ 'key': '1', 'value': 'Male' }, { 'key': '2', 'value': 'Female' }];

    this.corporatePositions = [{ 'key': '1', 'value': 'Asst. General Manager' },
    { 'key': '2', 'value': 'Asst. Manager' },
    { 'key': '3', 'value': 'Vice Precident' },
    { 'key': '4', 'value': 'Asst. Vice Precident' },
    { 'key': '5', 'value': 'Manager' },
    { 'key': '6', 'value': 'Sr.Excutive' },
    { 'key': '7', 'value': 'Excutive' },
    { 'key': '8', 'value': 'Sr.Manager' },
    { 'key': '9', 'value': 'CEO' },
    { 'key': '10', 'value': 'Director' },
    { 'key': '11', 'value': 'MD' }];

    if (this.userId != null || this.userId != undefined) {
      this._service.getUser(this.userId).subscribe((user: IUser) => {
        this.userModel = user;
        this.getStatesByCountry(user.countryId);
        setTimeout(() => {
          this.setCompanies(user.projectId, user.officeId,user.roleId);
        }, 500);

      });
    }

    this.initUserForm();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      title: [null],
      firstName: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      middleName: [null],
      phoneNumber: [null, [Validators.required, this.phoneNumberValidator, Validators.minLength(10)]],
      lastName: [null, Validators.required],
      dob: [],
      emailId: [null, [Validators.required, CustomValidators.email]],
      gender: [null],
      empCode: [null],
      corporatePosition: [null],
      selectedProject: [null,Validators.required],
      selectedOffice: [null],
      roleId: [null,Validators.required],
      reportTo: [null,Validators.required],
      countryId: [null],
      stateId: [null],
      city: [null],
      agentPhoneNumber: [null]
    });
  }

  setUserForm(user) {
    if (this.userForm) {
      this.userForm.setValue({
        title: user.title,
        firstName: user.firstName,
        middleName: user.middleName,
        phoneNumber: user.phoneNumber,
        lastName: user.lastName,
        dob: new Date(user.dob),
        emailId: user.emailId,
        gender: user.gender,
        empCode: user.empCode,
        corporatePosition: user.corporatePosition,
        selectedProject: this.selectedProject,
        selectedOffice: Number(user.officeId),
        roleId: user.roleId,
        reportTo: user.reportTo,
        countryId: user.countryId,
        stateId: user.stateId,
        city: user.city,
        agentPhoneNumber: user.agentPhoneNumber
      })
    } else {
      this.userForm = this.fb.group({
        title: [user.title],
        firstName: [user.firstName],
        middleName: [user.middleName],
        phoneNumber: [user.phoneNumber],
        lastName: [user.lastName],
        dob: [user.dob],
        emailId: [user.emailId],
        gender: [user.gender],
        empCode: [user.empCode],
        corporatePosition: [user.corporatePosition],
        selectedProject: [this.selectedProject],
        selectedOffice: [user.officeId],
        roleId: [user.roleId],
        reportTo: [user.reportTo],
        countryId: [user.countryId],
        stateId: [user.stateId],
        city: [user.city],
        agentPhoneNumber: [user.agentPhoneNumber]
      });
    }
  }

  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid ? null : { invalidNumber: { valid: false, value: control.value } }
  }

  onRoleChange(){

      var roleId = this.userForm.value["roleId"];
      var selectedProject = this.userForm.value["selectedProject"].join();

        this.getAllTeamLeadUsers(roleId,selectedProject);
    }

  getAllTeamLeadUsers(roleId,selectedProject) {
    var request = {
      roleId:roleId,
      projects:selectedProject
    };
    if(request.roleId == null || request.roleId == undefined){
      return;
    }
    if(request.projects == null || request.projects == undefined){
      return;
    }
    this._service.getSuperiors(request).subscribe(res => {
      this.reportToList = res;
    },
    error => {
      console.log(error);
    });
  }

  getRoles() {
    this._service.getRoles().subscribe(res => {
      this.roleList = res;
    },
    error => {
      console.log(error);
    });
  }

  getCountries() {
    this._service.getAllCountries().subscribe(res => {
      this.countryList = res;
    },
    error => {
      console.log(error);
    });
  }

  onCountryChange() {
    var countryId = this.userForm.value['countryId']
    this.getStatesByCountry(countryId);
  }

  getStatesByCountry(countryId) {
    this._service.getStatesOfCountry(countryId).subscribe(res => {
      this.stateList = res;
    },
    error => {
      console.log(error);
    });
  }

  setCompanies(projectId,officeId,roleId) {

    setTimeout(() => {
      this.setProjects(projectId);
      //this.setOffices(officeId);
      this.getAllTeamLeadUsers(roleId,this.selectedProject.join());
      this.setUserForm(this.userModel);
    }, 500);

  }

  setProjects(projectId) {
    let projects:number= [] = projectId.split(',').map(Number);
    this.userForm.controls["selectedProject"].setValue(projects);
    this.selectedProject = projects;

  }

  setOffices(officeId) {
    if(officeId != null){
      let offices:number = [] = officeId.split(",").map(Number);
      this.userForm.controls["selectedOffice"].setValue(offices);
      this.selectedOffice = offices;
    }

  }



  getProjectsByCompanies() {
    this._projectService.getProjectsByCompanyId(this.companyId).subscribe(res => {
      this.projectList = res;
      //this.addToProjectList(res);
    },
    error => {
      console.log(error);
    });
  }

  getOfficesByCompanies() {
    this._officeService.getAllOffice(this.companyId).subscribe(res => {
      this.offices =res;
      //this.addToOfficeList(res);
    },
      error => {
        console.log(error);
      });
  }

  addToProjectList(data) {
    for (var i = 0; i < data.length; i++) {
      var temp = this.projectList.filter(item => item.id === data[i].id);
      if (temp.length == 0) {
        this.projectList.push(data[i]);
      }
    }
    this.projectList = this.projectList.slice();
  }

  addToOfficeList(data) {
    for (var i = 0; i < data.length; i++) {
      var temp = this.offices.filter(item => item.id === data[i].id);
      if (temp.length == 0) {
        this.offices.push(data[i]);
      }
    }
    this.offices = this.offices.slice();
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.userForm.value.id = this.userId;
    this.userForm.value.companyId = this.companyId;
    this.userForm.value.projectId = this.userForm.value["selectedProject"].join();
    if(this.userForm.value.selectedOffice != '' && this.userForm.value.selectedOffice != null)
    {
        this.userForm.value.officeId = this.userForm.value["selectedOffice"];
     }

    this.userForm.value.selectedProject = '';
    this.userForm.value.selectedOffice = '';

    this.hasServerError = false;
    if (this.userForm.value.id > 0) {
      this._service.editUser(this.userForm.value).subscribe(res => {
        this.notificationService.success('User details updated successfully');
        this._route.navigate(['/admin/user-list']);
        //this.messageService.add({severity:'success', summary: 'Success Message', detail:'User details updated successfully.'});
      },
      error => {
        this.hasServerError = true;
        this.serverError = error;
      });
    }
    else {
      this._service.addNewUser(this.userForm.value).subscribe(res => {
        this.notificationService.success('User added successfully');
        //this.messageService.add({severity:'success', summary: 'Success Message', detail:'User added successfully.'});
        this._route.navigate(['/admin/user-list']);
      },
      error => {
        this.hasServerError = true;
        this.serverError = error;
      });
    }
  }

  onCancel() {
    this._route.navigate(['/admin/user-list']);
  }

}


