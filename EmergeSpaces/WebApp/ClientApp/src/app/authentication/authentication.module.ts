import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthenticationRoutes } from './authentication.routing';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot/forgotpassword.component';
import { DemoMaterialModule } from '../demo-material-module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthenticationRoutes),
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule
    ],
    entryComponents:[ForgotPasswordComponent],
    declarations: [
        ErrorComponent,
        ForgotPasswordComponent,
        LoginComponent,
    ]
})
export class AuthenticationModule { }
