import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CPService{
    public baseUrl = environment.apiUrl;
    constructor(private _http: HttpClient) {
    }

    getCPLead(id){
        let url = this.baseUrl + '/cp/cplead' + id;
        return this._http.get(url);
    }
    getCPLeadList(){
        let url = this.baseUrl + '/cp/cplead';
        return this._http.get(url);
    }
    deleteCPLead(data){
      let url = this.baseUrl + '/cp/cpdeletelead';
        return this._http.post(url,data);
    }
    getSalesUsers(){
      let url = this.baseUrl + '/cp/cpsalesuser';
        return this._http.get(url);
    }
    assignCPLead(data){
      let url = this.baseUrl + '/cp/cpassignto';
        return this._http.post(url,data);
    }
    addNewLead(data){
        let url = this.baseUrl + '/cp/cplead';
        return this._http.post(url, data);
    }

    getCPLeadStageData(projectId,period){
      let url = this.baseUrl + '/cp/getleadstagedata/' + projectId +"/"+ period;
      return this._http.get(url);
    }

    getLeadCreationData(projectId,period){
      let url = this.baseUrl + '/cp/lead-timeline/' + projectId +"/"+ period;
      return this._http.get(url);
    }

    generateCPReport(req){
      let url = this.baseUrl + '/cp/cp-report';
      return this._http.post<any>(url,req);
    }
  }
