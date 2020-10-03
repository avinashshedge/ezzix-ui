import { NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { EmailTemplateComponent } from "./email-campaign/email-template.component";
import { EmailBuildCampaignComponent } from "./email-campaign/email-build-campaign.component";
import { SafeHtmlPipe } from "../helpers/SafeHtmlPipe";
import { EmailCampaignsComponent } from "./email-campaign/email-campaigns.component";
import { ModalTemplateComponent } from "./email-campaign/modal-template.component";
import { MarketingRoutes } from "./marketing.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "../demo-material-module";
import { EmailTemplateListComponent } from "./email-campaign/email-template-list.component";
import { SMSTemplateComponent } from "./sms-campaign/sms-template.component";
import { SMSCampaignComponent } from "./sms-campaign/sms-campaign.component";
import { SMSBuildComponent } from "./sms-campaign/sms-build-campaign.component";
import { SMSDashboardComponent } from "./sms-campaign/sms-dashboard.component";
import { LeadListComponent } from "./lead-list/lead-list.component";
import { LeadListActionComponent } from "./lead-list/lead-list-action.component";
import { PageActionComponent } from "./landing-page/page-action.component";
import { PageListComponent } from "./landing-page/page-list.component";
import { UnmanagedLeadsComponent } from "./unmanaged-leads/unmanaged-leads.component";
import { FacebookCommentsComponent } from "./digital/facebook/facebook-comments";
import { FacebookSyncModalComponent } from "./digital/facebook/facebook-sync-modal.component";
import { FacebookAdsComponent } from "./digital/facebook/facebook-ads.component";
import { FacebookComponent } from "./digital/facebook/facebook.component";
import { LeadSourceListComponent } from "./lead-source/lead-source-list.component";
import { LeadSourceActionComponent } from "./lead-source/lead-source-action.component";
import { MarketingDashboardComponent } from "./dashboard/marketing-dashboard.component";
import { ChartsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { UnmanagedNewLeadComponent } from "./unmanaged-leads/unmanaged-new-lead.component";
import { AssignToComponent } from "./unmanaged-leads/assign-to.component";
import { PageDetailComponent } from "./landing-page/page-detail.component";
import { SMSCampaignDetailComponent } from "./sms-campaign/sms-campaign-detail.component";
import { EmailCampaignDetailComponent } from "./email-campaign/email-campaign-detail.component";
import { ImportLeadComponent } from "./unmanaged-leads/import-lead.component";
import { LibraryComponent } from "./library/library.component";
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule.forChild(MarketingRoutes),
      ReactiveFormsModule,
      FlexLayoutModule,
      DemoMaterialModule,
      ClipboardModule,
      ChartsModule,
      NgApexchartsModule,
    ],
    entryComponents: [ModalTemplateComponent,SMSTemplateComponent,SMSBuildComponent,UnmanagedNewLeadComponent,AssignToComponent,ImportLeadComponent,
                    LeadListActionComponent,PageActionComponent,LeadSourceActionComponent,
                    FacebookCommentsComponent,FacebookSyncModalComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [ SafeHtmlPipe,ModalTemplateComponent,EmailCampaignsComponent,
      EmailTemplateListComponent,EmailBuildCampaignComponent,EmailTemplateComponent,
      SMSTemplateComponent,SMSCampaignComponent,SMSBuildComponent,SMSDashboardComponent,
      SMSCampaignDetailComponent,EmailCampaignDetailComponent,
      LeadListComponent,LeadListActionComponent,LeadSourceListComponent,LeadSourceActionComponent,ImportLeadComponent,LibraryComponent,
      PageActionComponent,PageListComponent,PageDetailComponent,UnmanagedLeadsComponent,UnmanagedNewLeadComponent,AssignToComponent,MarketingDashboardComponent,
      FacebookComponent,FacebookCommentsComponent,FacebookAdsComponent,FacebookCommentsComponent,FacebookSyncModalComponent]
  })

  export class MarketingModule {

  }
