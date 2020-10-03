import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SalesService {
  public baseUrl = environment.apiUrl; //"http://localhost:62143/api";
  constructor(private http: HttpClient) {
  }

  filterLeadList(request) {
    let url = this.baseUrl + '/sales/filtered-leads';
    return this.http.post(url,request);
  }
  getSaleLeadOwners(projectId){
    let url = this.baseUrl + '/sales/leadowners/'+ projectId;
    return this.http.get(url);
  }
  getCPUsers(){
    let url = this.baseUrl + '/cp/cpfirmuser';
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

  getAllLeads(projectId) {
    let url = this.baseUrl + '/sales/leads/'+ projectId;
    return this.http.get(url);
  }

  getLeadDetails(leadId) {
    let url = this.baseUrl + '/sales/' + leadId;
    return this.http.get(url);
  }

  addActivity(activity) {
    let url = this.baseUrl + '/activity';
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

  getPresaleActivityTypes(isShow) {
    let url = this.baseUrl + '/activity/presale-activitytypes/' + isShow;
    return this.http.get(url);
  }

  getActivityReasons() {
    let url = this.baseUrl + '/activity/reasons';
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



    /*------------------Lead action------------*/
    getAllExecutiveUsers(){
        let url = this.baseUrl + '/user/executives';
        return this.http.get(url);
    }

    changeOwner(data){
      let url = this.baseUrl + '/lead/changeowner';
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
