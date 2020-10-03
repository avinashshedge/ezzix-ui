import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AutomationService{
    public baseUrl = environment.apiUrl;
    constructor(private _http: HttpClient) {
    }

    getAutomation(id){
        let url = this.baseUrl + '/automation/' + id;
        return this._http.get(url);
    }

    getAutomationList(){
        let url = this.baseUrl + '/automation';
        return this._http.get(url);
    }

    updateWorkFlow(data){
        let url = this.baseUrl + '/automation/' + data.id;
        return this._http.put(url, data);
    }
    saveWorkFlow(data){
        let url = this.baseUrl + '/automation';
        return this._http.post(url, data);
    }

    updateActiveStatus(data){
        let url = this.baseUrl + '/automation/update-status';
        return this._http.post(url, data);
    }
};
