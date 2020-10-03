import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService{
  public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }
 
  //Company
  
  getAllCompany() {
    let url = this.baseUrl + '/Company';
    return this._http.get(url);
  }
  getCompany(id) {
    let url = this.baseUrl + '/Company/'+id;
    return this._http.get(url);
  }

  addCompany(data) {
    let url = this.baseUrl + '/Company';
    return this._http.post(url, data); 
  } 

  updateCompany(company) {
    let url = this.baseUrl + '/Company/' + company.id;
    return this._http.put(url, company);
  }
  
  deleteCompany(id) {
    let url = this.baseUrl + '/Company/'+id;
    return this._http.delete(url, id);
  }
  
};
