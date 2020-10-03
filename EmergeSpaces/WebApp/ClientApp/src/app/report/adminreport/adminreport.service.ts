import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AdminReportService {
  public baseUrl = environment.apiUrl; //"http://localhost:62143/api";
  constructor(private http: HttpClient) {
  }

  generateUserReport(req){
    let url = this.baseUrl + '/report/userreport';
    return this.http.post<any>(url,req);
  }

  generateLoginReport(req){
    let url = this.baseUrl + '/report/loginreport';
    return this.http.post<any>(url,req);
  }

  generateEmailUsageReport(req){
    let url = this.baseUrl + '/report/emailusagereport';
    return this.http.post<any>(url,req);
  }
  generateSMSUsageReport(req){
    let url = this.baseUrl + '/report/smsusagereport';
    return this.http.post<any>(url,req);
  }
  generateDeletedLeadsReport(req){
    let url = this.baseUrl + '/report/deletedleadsreport';
    return this.http.post<any>(url,req);
  }
  generateLeadsReport(req){
    let url = this.baseUrl + '/report/leadsreport';
    return this.http.post<any>(url,req);
  }
}

