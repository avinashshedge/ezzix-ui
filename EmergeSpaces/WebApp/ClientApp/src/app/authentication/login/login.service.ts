import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) { }
  public baseUrl = environment.apiUrl;
  login(model) {
    return this.http.post(this.baseUrl + '/Identity/login', model);
  }

  forgotpassword(data){
    return this.http.post(this.baseUrl + '/user/forgotpassword', data);
  }

  resetpassword(data){
    return this.http.post(this.baseUrl + '/user/resetpassword', data);
  }
  
}
