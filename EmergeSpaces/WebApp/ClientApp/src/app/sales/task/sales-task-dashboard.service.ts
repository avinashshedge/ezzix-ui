import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({'providedIn':'root'})
export class SalesTaskDashboardService {
  public baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }

  getAllTasks(projectId,period) {
    let url = this.baseUrl + '/task/sales-all-task/' + projectId + "/" + period;
    return this.http.get(url);
  }

  updateTaskStatus(id) {
    let url = this.baseUrl + '/task/update-task-status';
    return this.http.post(url,id);
  }

}
