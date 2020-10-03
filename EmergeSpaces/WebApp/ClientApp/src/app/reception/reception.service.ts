import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReceptionService{
    public baseUrl = environment.apiUrl;
    constructor(private _http: HttpClient) {
    }

    getSalesUser(id){
      let url = this.baseUrl + '/reception/salesuser/' + id;
      return this._http.get(url);
    }

    addNewLead(data){
      let url = this.baseUrl + '/reception';
      return this._http.post(url, data);
    }

    getCustomerList(){
      let url = this.baseUrl + '/reception/booked-customers';
      return this._http.get(url);
    }
}
