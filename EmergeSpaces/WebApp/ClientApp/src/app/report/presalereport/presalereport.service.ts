import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PresaleReportService {
  public baseUrl = environment.apiUrl; //"http://localhost:62143/api";
  constructor(private http: HttpClient) {
  }

  generateLeadCountReport(req){
    let url = this.baseUrl + '/report/presaleleadcountreport';
    return this.http.post<any>(url,req);
  }
}
