import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class MarketingService {
  public baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }
getParameters(){
   let url = this.baseUrl + '/common/parameters';
    return this.http.get(url);
}
  getLeadList(projectId){
    let url = this.baseUrl + '/leadlist/all/' + projectId;
    return this.http.get(url);
  }

  getLeadListDetails(id){
    let url = this.baseUrl + '/leadlist/' + id;
    return this.http.get(url);
  }

  saveLeadDetails(data){
    let url = this.baseUrl + '/leadlist';
    return this.http.post(url, data);
  }

  getEmailTemplateList(projectId){
    let url = this.baseUrl + '/email/emailtemplate/all/' + projectId;
    return this.http.get(url);
  }

  getEmailTemplatesByProject(projectId){
    let url = this.baseUrl + '/email/templatebyproject/' + projectId;
    return this.http.get(url);
  }

  getEmailTemplate(id){
    let url = this.baseUrl + '/email/emailtemplate/' + id;
    return this.http.get(url);
  }

  runEmailCampaign(id){
    let url = this.baseUrl + '/email/run-emailcampaign';
    return this.http.post(url,id);
  }

  saveEmailTemplate(data){
    let url = this.baseUrl + '/email/emailtemplate';
    return this.http.post(url, data);
  }

  getSMSTemplateList(projectId){
    let url = this.baseUrl + '/sms/smstemplate/all/' + projectId;
    return this.http.get(url);
  }

  getSMSTemplate(id){
    let url = this.baseUrl + '/sms/smstemplate/' + id;
    return this.http.get(url);
  }

  saveSMSTemplate(data){
    let url = this.baseUrl + '/sms/smstemplate';
    return this.http.post(url, data);
  }

  getSMSCampaignList(projectId){
    let url = this.baseUrl + '/sms/smscampaign/all/' + projectId;
    return this.http.get(url);
  }

  getSMSCampaign(id){
    let url = this.baseUrl + '/sms/smscampaign/' + id;
    return this.http.get(url);
  }

  runSMSCampaign(id){
    let url = this.baseUrl + '/sms/run-smscampaign';
    return this.http.post(url,id);
  }

  saveSMSCampaign(data){
    let url = this.baseUrl + '/sms/smscampaign';
    return this.http.post(url, data);
  }

  deleteSMSCampaign(data){
    let url = this.baseUrl + '/sms/delete-smscampaigns';
    return this.http.post(url, data);
  }

  getEmailCampaignList(projectId){
    let url = this.baseUrl + '/email/emailcampaign/all/' + projectId;
    return this.http.get(url);
  }

  getEmailCampaign(id){
    let url = this.baseUrl + '/email/emailcampaign/' + id;
    return this.http.get(url);
  }

  saveEmailCampaign(data){
    let url = this.baseUrl + '/email/emailcampaign';
    return this.http.post(url, data);
  }

  sendTestEmail(data){
    let url = this.baseUrl + '/email/emailcampaign/sendtestmail';
    return this.http.post(url, data);
  }


  deleteEmailCampaign(data){
    let url = this.baseUrl + '/email/delete-emailcampaigns';
    return this.http.post(url, data);
  }


  addUnmanagedLead(data){
    let url = this.baseUrl + '/unmanagedleads';
    return this.http.post(url, data);
  }

  assignTo(data){
    let url = this.baseUrl + '/unmanagedleads/assign-to';
    return this.http.post(url, data);
  }

  deleteUnmanagedLead(data){
    let url = this.baseUrl + '/unmanagedleads/delete-unassigned-leads';
    return this.http.post(url, data);
  }

  getUnmanagedLeads(projectId){
    let url = this.baseUrl + '/unmanagedleads/leads/' + projectId;
    return this.http.get(url);
  }

  syncLeads(data){
    let url = this.baseUrl + '/marketing/sync-facebook-leads';
    return this.http.post(url, data);
  }

  getLeadSources(){
    let url = this.baseUrl + '/leadsubsource/lead-sources';
    return this.http.get(url);
  }

  getLeadSubSources(projectId){
    let url = this.baseUrl + '/leadsubsource/all/' + projectId;
    return this.http.get(url);
  }


  getLeadSubSourcesBySource(id){
    let url = this.baseUrl + '/leadsubsource/lead-sub-sources/' +id;
    return this.http.get(url);
  }

  saveLeadSubSource(data){
    let url = this.baseUrl + '/leadsubsource';
    return this.http.post(url, data);
  }


  getPages(projectId){
    let url = this.baseUrl + '/landingpage/all/'+ projectId;
    return this.http.get(url);
  }

  saveLandingPage(data){
    let url = this.baseUrl + '/landingpage';
    return this.http.post(url, data);
  }

  getPageDetail(id){
    let url = this.baseUrl + '/landingpage/' + id;
    return this.http.get(url);
  }

  getLibraries(projectId){
    let url = this.baseUrl + '/library/' + projectId;
    return this.http.get(url);
  }

  deleteLibrary(id){
    let url = this.baseUrl + '/library/' + id;
    return this.http.delete(url);
  }

  uploadDocument(formData: FormData){
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const httpOptions = { headers: headers };

    return  this.http.post(this.baseUrl + '/library/upload-document', formData, httpOptions);

  }
  /*---------------import------------*/
  uploadExcel(formData: FormData) {
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const httpOptions = { headers: headers };

    return  this.http.post(this.baseUrl + '/unmanagedleads/uploadExcel', formData, httpOptions)
                      .pipe(
                        map(x => {   return x  })
                      );

    }


}
