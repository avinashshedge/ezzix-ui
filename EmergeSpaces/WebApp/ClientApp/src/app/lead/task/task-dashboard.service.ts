import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({'providedIn':'root'})
export class TaskDashboardService {
  public baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }

  getAllTasks(projectId,period) {
    let url = this.baseUrl + '/task/all-task/' + projectId + "/" + period;
    return this.http.get(url);
  }

  updateTaskStatus(id) {
    debugger;
    let url = this.baseUrl + '/task/update-task-status';
    return this.http.post(url,id);
  }

}
