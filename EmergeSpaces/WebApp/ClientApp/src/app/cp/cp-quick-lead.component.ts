import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../NotificationService";
import { CPService } from "./cp.service";
import { LeadService } from "../lead/lead.service";
import { Observable, combineLatest } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';


@Component({
  selector:'cp-quick-lead',
  templateUrl:'./cp-quick-lead.component.html'
})

export class CPQuickLeadComponent implements OnInit{
  quick_lead_form:FormGroup;
  constructor(private service:CPService, private fb:FormBuilder, private diaglogRef : MatDialogRef<CPQuickLeadComponent>,private leadService:LeadService,
    public messageService :NotificationService){
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.quick_lead_form = this.fb.group({
      firstName: [null, Validators.required],
      primaryNumber: [null, [Validators.required,
        this.phoneNumberValidator,
        Validators.minLength(10)],
        this.validateNumberViaServer.bind(this)],
      lastName: [null],
      emailId: [null, [Validators.required, Validators.email],
              this.validateEmailViaServer.bind(this)]
    });
  }


  validateNumberViaServer({value}: AbstractControl): Observable <ValidationErrors | null> {
    const validations: Observable<boolean>[] = [];
      const numberExists$: Observable<boolean> = this.leadService.validateLeadMobileNumber(value);
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
    const emailExists$: Observable<boolean> = this.leadService.validateLeadEmail(value);
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

  phoneNumberValidator(    control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }

  // convenience getter for easy access to form fields
  get f() { return this.quick_lead_form.controls; }

  onSubmit(){
    if (this.quick_lead_form.invalid) {
      return;
    }
    this.service.addNewLead(this.quick_lead_form.value).subscribe(res => {
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
