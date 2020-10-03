import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root'})
export class OfficeService{
  public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }

//office
  getAllOffice(id) {
    let url = this.baseUrl + '/Office/offices/' + id;
    return this._http.get(url);
  }
  getOffice(id) {
    let url = this.baseUrl + '/Office/'+id;
    return this._http.get(url);
  }

  addOffice(data) {
    let url = this.baseUrl + '/Office';
    return this._http.post(url, data);
  }

  editOffice(office) {
    let url = this.baseUrl + '/Office/' +office.id;
    return this._http.put(url, office);
  }

  deleteOffice(id) {
    let url = this.baseUrl + '/Office/' + id;
    return this._http.delete(url, id);
  }
};
