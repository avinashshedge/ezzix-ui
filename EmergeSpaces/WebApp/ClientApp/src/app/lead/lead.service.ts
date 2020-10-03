import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeadService {
  public baseUrl = environment.apiUrl; //"http://localhost:62143/api";
  constructor(private http: HttpClient) {
  }

  validateLeadMobileNumber(number){
    let url = this.baseUrl + '/lead/validate-lead-mobile/' + number;
    return this.http.get<any>(url);
  }

  validateLeadEmail(email){
    let url = this.baseUrl + '/lead/validate-lead-email/' + email;
    return this.http.get<any>(url);
  }

  getParameters(){
    let url = this.baseUrl + '/common/parameters';
    return this.http.get(url);
  }

  getBudgetRange(){
    let url = this.baseUrl + '/lead/budgetrange';
    return this.http.get(url);
  }

  getLeadSources() {
    let url = this.baseUrl + '/leadsubsource/lead-sources';
    return this.http.get(url);
  }

  getLeadStages(){
    let url = this.baseUrl + '/lead/leadstages';
    return this.http.get(url);
  }

  getPresaleLeadOwners(projectId){
    let url = this.baseUrl + '/lead/leadowners/'+ projectId;
    return this.http.get(url);
  }


  filterLeadList(request) {
    let url = this.baseUrl + '/lead/filtered-leads';
    return this.http.post(url,request);
  }

  getAllLeads(projectId) {
    let url = this.baseUrl + '/lead/leads/'+ projectId;
    return this.http.get(url);
  }

  addNewLead(data) {
    let url = this.baseUrl + '/lead';
    return this.http.post(url, data);
  }

  saveLead(data) {
    let url = this.baseUrl + '/lead';
    return this.http.put(url, data);
  }

  getLeadDetails(leadId) {
    let url = this.baseUrl + '/lead/' + leadId;
    return this.http.get(url);
  }
  addActivity(activity) {
    let url = this.baseUrl + '/activity';
    return this.http.post(url, activity);
  }
  runActivityAutomation(activity) {
    let url = this.baseUrl + '/activity/run-activity-automation';
    return this.http.post(url, activity);
  }
  getActivityTypes(isShow) {
    let url = this.baseUrl + '/activity/activitytypes/' + isShow;
    return this.http.get(url);
  }

  getAllleadmanageactivites() {
    let url = this.baseUrl + '/lead/get/all/manageactivites';
    return this.http.get(url);
  }
   getActivitiesByLead(id,filter) {
    let url = this.baseUrl + '/activity/activities/' + id + "?filter=" + filter;
    return this.http.get(url);
  }

  getSalesActivitiesByLead(id,filter) {
    let url = this.baseUrl + '/activity/sales-activities/' + id + "?filter=" + filter;
    return this.http.get(url);
  }

  getPresaleActivityTypes(isShow) {
    let url = this.baseUrl + '/activity/presale-activitytypes/' + isShow;
    return this.http.get(url);
  }

  getSaleActivityTypes(isShow) {
    let url = this.baseUrl + '/activity/sales-activitytypes/' + isShow;
    return this.http.get(url);
  }

  getActivityReasons() {
    let url = this.baseUrl + '/activity/reasons';
    return this.http.get(url);
  }

  getSaleUsers(){
    let url = this.baseUrl + '/user/sales-users';
    return this.http.get(url);

  }

  /*-------task-----*/

  saveTask(task) {
    let url = this.baseUrl + '/task';
    return this.http.post(url, task);
  }

  updateTask(task) {
    let url = this.baseUrl + '/task';
    return this.http.put(url, task);
  }

  getTask(taskId) {
    let url = this.baseUrl + '/task/' + taskId;
    return this.http.get(url);
  }

  getAllTask(leadId) {
    let url = this.baseUrl + '/task/tasks/'+ leadId;
    return this.http.get(url);
  }


  /*--------------notes-------------*/
  saveNotes(notes) {
    let url = this.baseUrl + '/notes';
    return this.http.post(url, notes);
  }

  getAllNotes(leadId) {
    let url = this.baseUrl + '/notes/notesbylead/' + leadId;
    return this.http.get(url);
  }

  /*---------------import------------*/
  uploadExcel(formData: FormData) {
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const httpOptions = { headers: headers };

    return  this.http.post(this.baseUrl + '/lead/uploadExcel', formData, httpOptions).pipe(
                        map(x => {   return x  })
                      );

    }


    /*------------------Lead action------------*/
    getAllExecutiveUsers(projectId){
        let url = this.baseUrl + '/user/executives/' + projectId;
        return this.http.get(url);
    }

    changeOwner(data){
      let url = this.baseUrl + '/lead/changeowner';
      return this.http.post(url,data);
    }

    changeStage(data){
      let url = this.baseUrl + '/lead/changestage';
      return this.http.post(url,data);
    }

    bulkUpdate(data){
      let url = this.baseUrl + '/lead/bulkupdate';
      return this.http.post(url,data);
    }

    cloneLead(data){
      let url = this.baseUrl + '/lead/clone';
      return this.http.post(url,data);
    }

    deleteLeads(data){
      let url = this.baseUrl + '/lead/deleteleads';
      return this.http.post(url,data);
    }


    /*--------------Email------------*/
    sendEmail(request) {
      let url = this.baseUrl + '/email/send-email';
      return this.http.post(url, request);
    }

    /*--------------SMS------------*/
    sendSMS(request) {
      let url = this.baseUrl + '/sms/send-sms';
      return this.http.post(url, request);
    }
}
