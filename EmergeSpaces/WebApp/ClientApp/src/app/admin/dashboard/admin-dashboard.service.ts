import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService{
    public baseUrl = environment.apiUrl;
    constructor(private _http: HttpClient) {
    }

    getEmailCredits(){
      let url = this.baseUrl + '/admindashboard/email-credits';
      return this._http.get(url);
    }

    getSmsCredits(){
      let url = this.baseUrl + '/admindashboard/sms-credits';
      return this._http.get(url);
    }

    getActiveDeactiveUsers(projectId) {
      let url = this.baseUrl + '/admindashboard/active-deactive-users?projectId=' + projectId ;
        return this._http.get(url);
    }

    getLoginLeaderboard(projectId){
        let url = this.baseUrl + '/admindashboard/login-leaderboard?projectId=' + projectId;
        return this._http.get(url);
    }
    getProjectwiseUsers() {
        let url = this.baseUrl + '/admindashboard/project-users';
          return this._http.get(url);
    }

}
