import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { LoginService } from './login.service';
import { AuthenticationResponse } from './authenticationresponse.model';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot/forgotpassword.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;hide = true;
  hasServerError = false;serverError;
  response;loading = false;
  constructor(private fb: FormBuilder, private dialog:MatDialog, private router: Router,private loginService:LoginService) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onLogin() {
    this.loading = true;
    this.loginService.login(this.form.value).subscribe(
      (res: AuthenticationResponse) => {
        if (res.success == true) {
          this.response = res;
          localStorage.setItem('token', JSON.stringify(this.response.token));
          localStorage.setItem('role', JSON.stringify(this.response.role));
          localStorage.setItem('username', JSON.stringify(this.response.userName));
          localStorage.setItem('companyId', this.response.companyId);
          localStorage.setItem('userId', JSON.stringify(this.response.userId));
          //uncomment below code after adding different module
          //this.router.navigate(['/']);

          if(this.response.role == "Admin"){
            this.router.navigate(['/admin']);
          }else if(this.response.role == "Marketing Manager" || this.response.role == 'Marketing Executive'){
            this.router.navigate(['/marketing']);
          }else if(this.response.role == "Sales Manager"
          || this.response.role == 'Sales Executive' || this.response.role == 'Sales TL'){
            this.router.navigate(['/sales']);
          }else if(this.response.role == "CP User"){
            this.router.navigate(['/cp']);
          }
          else if(this.response.role == "Receptionist"){
            this.router.navigate(['/reception']);
          }
          else{
            this.router.navigate(['/lead']);
          }
        }
        else {
          this.loading = false;
          this.hasServerError = true;
          this.serverError = res.errors;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  onForgotPassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(ForgotPasswordComponent,dialogConfig);

  }
}
