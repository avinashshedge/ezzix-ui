import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { AppBreadcrumbComponent } from './layouts/full/breadcrumb/breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { FabComponent } from './helper-component/fab.component';
import { QuickLeadComponent } from './lead/quick-lead/quick-lead.component';
import { DetailLeadComponent } from './lead/detail-lead/detail-lead.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ResetPasswordComponent } from './authentication/reset/resetpassword.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 2,
    wheelPropagation: true
};

@NgModule({
    declarations: [
        AppComponent,
        FullComponent,
        AppHeaderComponent,
        SpinnerComponent,
        AppBlankComponent,
        AppSidebarComponent,
        AppBreadcrumbComponent,        
        FabComponent,
        QuickLeadComponent,
        DetailLeadComponent,
        ConfirmationDialogComponent,
        ResetPasswordComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        PerfectScrollbarModule,
        SharedModule,
        NgMultiSelectDropDownModule.forRoot(),
        RouterModule.forRoot(AppRoutes)
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,            
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
            { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    entryComponents:[QuickLeadComponent,DetailLeadComponent,ConfirmationDialogComponent,ResetPasswordComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
