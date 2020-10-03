import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({'providedIn':'root'})
export class PresaleDashboardService {
  public baseUrl = environment.apiUrl;
  //public baseUrl = "http://localhost:62143/api";
  constructor(private http: HttpClient) {
  }

  getLeadStageData(projectId,period) {
    let url = this.baseUrl + '/dashboard/stages/' + projectId + "/" + period;
    return this.http.get(url);
  }

  getLeadsBySource(projectId,period) {
    let url = this.baseUrl + '/dashboard/lead-sources/'+ projectId + "/" + period;
    return this.http.get(url);
  }

  getTodaysTask(projectId){
    let url = this.baseUrl + '/dashboard/todays-task/'+ projectId;
    return this.http.get(url);
  }

  getLeadSourceData(projectId,period) {
    let url = this.baseUrl + '/dashboard/sources/'+ projectId + "/" + period;
    return this.http.get(url);
  }

  getOpenLeadsByAgent(projectId,period) {
    let url = this.baseUrl + '/dashboard/agent-open-leads/' + projectId + "/" + period;
    return this.http.get(url);
  }

  getTopPerformer(projectId,period) {
    let url = this.baseUrl + '/dashboard/agent-top-performer/'+ projectId + "/" + period;
    return this.http.get(url);
  }


  getLeadsByAge(projectId,period) {
    let url = this.baseUrl + '/dashboard/agent-leads-age/' + projectId + "/" + period;
    return this.http.get(url);
  }


  getBookingRatio(period){
    let url = this.baseUrl + '/dashboard/booking-ratio?period=' + period;
    return this.http.get(url);
  }

  getLeadCreationData(projectId , period) {
    let url = this.baseUrl + '/dashboard/lead-timeline/' + projectId + "/" + period;
    return this.http.get(url);
  }

  getLeadTaskSummary(projectId,period) {
    let url = this.baseUrl + '/dashboard/task-summary/'+ projectId +'/' + period;
    return this.http.get(url);
  }
}
