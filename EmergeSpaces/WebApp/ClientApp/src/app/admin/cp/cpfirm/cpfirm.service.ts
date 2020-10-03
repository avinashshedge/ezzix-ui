import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CPFirmService{
  public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }

  getAllFirms() {
    let url = this.baseUrl + '/cp/cpfirm';
    return this._http.get(url);
  }

  getFirmById(id) {
    let url = this.baseUrl + '/cp/cpfirm/'+id;
    return this._http.get(url);
  }

  addFirm(data) {
    let url = this.baseUrl + '/cp/cpfirm';
    return this._http.post(url, data); 
  } 

  updateFirm(data) {
    let url = this.baseUrl + '/cp/cpfirm';
    return this._http.put(url, data);
  }
  
  deleteFirm(id) {
    let url = this.baseUrl + '/cp/cpfirm/'+ id;
    return this._http.delete(url, id);
  }
}