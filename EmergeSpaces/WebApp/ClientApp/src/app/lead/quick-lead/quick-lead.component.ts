import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  AbstractControl, ValidationErrors } from '@angular/forms';
import { LeadService } from '../lead.service';
import { ProjectService } from '../../admin/project/project.service';
import { NotificationService } from '../../NotificationService';
import { MatDialogRef } from '@angular/material/dialog';
import { MarketingService } from '../../marketing/marketing.service';
import { Observable, combineLatest } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'quick-lead',
  templateUrl: './quick-lead.component.html',
  encapsulation: ViewEncapsulation.None
})

export class QuickLeadComponent implements OnInit {
  public quick_lead_form: FormGroup;
  submitted = false;
  selectedProject= [];
  public projects: any;
  public budgetRange: any;
  public leadSources: any;
  public leadSubSource;

  constructor(private _service: LeadService, private _projectService: ProjectService,
    private marketingService:MarketingService,
    private diaglogRef : MatDialogRef<QuickLeadComponent>,
    public messageService :NotificationService,private fb: FormBuilder) {

    this.quick_lead_form = this.fb.group({
        firstName: [null, Validators.required],
        primaryMobile: [null, [Validators.required,
                        this.phoneNumberValidator,
                        Validators.minLength(10)],
                        this.validateNumberViaServer.bind(this)],
        lastName: [null],
        emailId: [null, [Validators.required, Validators.email],
                        this.validateEmailViaServer.bind(this)],
        selectedProject: [null,Validators.required],
        budget: [null],
        leadSource: [null, [Validators.required]],
        leadSubSource:[null]
    });
  }


  phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid ? null : { invalidNumber: { valid: false, value: control.value } }
  }

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

 // convenience getter for easy access to form fields
  get f() { return this.quick_lead_form.controls; }

  ngOnInit() {
    this.projects = this.getProjects();
    this.getBudgetRange();
    this.leadSources = this.getLeadSources();
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

  getBudgetRange(){
    this._service.getBudgetRange().subscribe(res => {
      this.budgetRange = res;
    },
      error => {
        console.log(error);
      });
  }

  getProjects() {
    this._projectService.getAllProject().subscribe(res  => {
      this.projects = res;
    },
      error => {
        console.log(error);
      });
  }

  getLeadSources(){
    this._service.getLeadSources().subscribe(res => {
      this.leadSources = res;
    },
      error => {
        console.log(error);
      });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.quick_lead_form.invalid) {
      return;
    }
    if(this.quick_lead_form.value.selectedProject != null){
      this.quick_lead_form.value.interestedProject = this.quick_lead_form.value.selectedProject;
    }
    this._service.addNewLead(this.quick_lead_form.value).subscribe(res => {
      this.messageService.success('Lead added successfully');
      this.onClose();
    },
    error => {
      console.log(error);
      this.onClose();
    });

  }

  onClose(){
    this.diaglogRef.close()
    //this.ref.close();
  }

}
