import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({'providedIn':'root'})
export class SaleDashboardService {
  public baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }

  getLeadStageData(id,period){
    let url = this.baseUrl + '/salesdashboard/lead-stages/' + id + "/" + period;
    return this.http.get(url);
  }

  getSalesAnalyticsData(id,period){
    let url = this.baseUrl + '/salesdashboard/sales-analytics/' + id + "/" + period;
    return this.http.get(url);
  }

  getLeadsBySource(id,period){
    let url = this.baseUrl + '/salesdashboard/lead-sources/' + id + "/" + period;
    return this.http.get(url);
  }
  getTaskSummary(id,period)  {
    let url = this.baseUrl + '/salesdashboard/task-summary/' + id + "/" + period;
    return this.http.get(url);
  }
  getSalesGrowthData(projectId) {
    let url = this.baseUrl + '/salesdashboard/sales-growth/' + projectId;
    return this.http.get(url);
  }

  getLeadFlowData(projectId) {
    let url = this.baseUrl + '/salesdashboard/lead-flow/' + projectId;
    return this.http.get(url);
  }

  getOpenLeadData(id){
    let url = this.baseUrl + '/salesdashboard/top-open-leads/' + id;
    return this.http.get(url);
  }

  getAgedLeadData(id){
    let url = this.baseUrl + '/salesdashboard/top-aged-leads/' + id;
    return this.http.get(url);
  }

  getTopPerfomerConversionData(id){
    let url = this.baseUrl + '/salesdashboard/top-performer-conversion/' + id;
    return this.http.get(url);
  }

  getTopPerfomerWonData(id){
    let url = this.baseUrl + '/salesdashboard/top-performer-won/' + id;
    return this.http.get(url);
  }
}
