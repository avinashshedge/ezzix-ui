import { Project } from '../project-model';
import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { UserService } from '../../user/user.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationService } from '../../../NotificationService';

@Component({
  selector: 'project-activity',
  templateUrl: './Project-Activity-Component.html',
})
export class ProjectActivityComponent implements OnInit {
  public submitted = false;
  public projectForm: FormGroup;
  public projectId: any;
  public dissableFlag: boolean;
  public countryList: any;

  public stateList: any;
  public companyId: any;
  projectModel : any =  new Project('', '', '', '', '', '', '', '', '', '', '', '', '');

  constructor(private _service: ProjectService,private userService:UserService,    private fb: FormBuilder,
    private diaglogRef : MatDialogRef<ProjectActivityComponent>, private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dissableFlag = false;
  }

  ngOnInit() {
    this.getCountries();
    this.initProjectForm();

    this.companyId = this.data.companyId;
    this.projectId = this.data.projectId;
    if (this.projectId > 0) {
      this._service.getProject(this.projectId).subscribe((project: Project) => {
        this.projectModel = project;
        this.getStatesByCountry(this.projectModel.countryId);
        this.setProjectForm(project);
      });
    }
  }

  
  get f() { return this.projectForm.controls; }

  initProjectForm(){
    this.projectForm = this.fb.group({
      projectName: [null, Validators.required],
      projectCode: [null],
      estimatedStartDate:[null],
      estimatedEndDate:[null],
      totalSaleableArea:[null],
      reraNo:[null],
      currencyId: [null],
      address: [null],
      countryId: [null],
      stateId: [null],
      city: [null],
      zipCode:[null],
      website:[null],
      propertyDetails:[null]
    });
  }

  setProjectForm(data){
    
    this.projectForm = this.fb.group({
      projectName: data.projectName,
      projectCode:data.projectCode,
      estimatedStartDate:data.estimatedStartDate,
      estimatedEndDate:data.estimatedEndDate,
      totalSaleableArea:data.totalSaleableArea,
      reraNo:data.reraNo,
      currencyId: data.currencyId,
      address: data.address,
      countryId: data.countryId,
      stateId: data.stateId,
      city: data.city,
      zipCode:data.zipCode,
      website:data.website,
      propertyDetails:data.propertyDetails
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

  saveProject() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.projectForm.invalid) {
      return;
    }

    this.projectForm.value.companyId = this.companyId;
    this.projectForm.value.id = this.projectId;
    this.dissableFlag = true;
    if (this.projectId > 0) {
      this._service.editProject(this.projectForm.value).subscribe(res => {
        setTimeout(() => {
          this.projectForm.reset();
          this.submitted =false;
          this.notificationService.success('Project updated');
          //this.messageService.add({severity:'success', summary: 'Success Message', detail:'Project updated'});
          this.diaglogRef.close();
        }, 1000);
      },
      error => {
        console.log(error);
      });
    }
    else {
      this._service.addProject(this.projectForm.value).subscribe(res => {
        setTimeout(() => {
          this.projectForm.reset();
          this.submitted =false;
          
          this.notificationService.success('Project added');
          //this.messageService.add({severity:'success', summary: 'Success Message', detail:'Project created'});
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

