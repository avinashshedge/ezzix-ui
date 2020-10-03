import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService{
   public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }

  //Country-State-city

  getAllCountries() {
    let url = this.baseUrl + '/CountryStateCity/countries';
    return this._http.get(url); 
 }
  getStatesOfCountry(id){
    let url = this.baseUrl + '/CountryStateCity/states?countryId='+ id;
    return this._http.get(url);
  }

  getCityOfState() {
    let url = this.baseUrl + '/CountryStateCity/cities';
    return this._http.get(url);
  }

  //user
  getAllUsers() {
    let url = this.baseUrl + '/user/users';
    return this._http.get(url); 
  }

  addNewUser(data) {
    let url = this.baseUrl + '/user';
    return this._http.post(url, data); 
  } 

 getUser(id) {
    let url = this.baseUrl + '/user?id='+ id;
    return this._http.get(url);  
  }
     
  editUser(data) {
    let url = this.baseUrl + '/user?id=' + data.id;
    return this._http.put(url, data);  
  }

  deleteUser(id){
    let url = this.baseUrl + '/user/deleteuser';
      return this._http.post(url,id);
    }

    getSuperiors(data) {
      let url = this.baseUrl + '/user/superiors';
      return this._http.post(url,data); 
    }

  getRoles() {
    let url = this.baseUrl + '/user/roles';
    return this._http.get(url);
  }

};
