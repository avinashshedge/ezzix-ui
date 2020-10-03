import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CPUserService{
  public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }

  getAllCPUsers() {
    let url = this.baseUrl + '/cp/cpfirmuser';
    return this._http.get(url);
  }

  getCPUserById(id) {
    let url = this.baseUrl + '/cp/cpfirmuser/'+id;
    return this._http.get(url);
  }

  addUser(data) {
    let url = this.baseUrl + '/cp/cpfirmuser';
    return this._http.post(url, data); 
  } 

  updateCpUser(data) {
    let url = this.baseUrl + '/cp/cpfirmuser';
    return this._http.put(url, data);
  }
  
  deleteCPUser(id) {
    let url = this.baseUrl + '/cp/cpfirmuser/'+ id;
    return this._http.delete(url, id);
  }
}