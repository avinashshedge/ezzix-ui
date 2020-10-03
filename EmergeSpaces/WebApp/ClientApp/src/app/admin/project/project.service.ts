import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {
  }

  //project

  getAllProject() {
    let url = this.baseUrl + '/Project/allprojects';
    return this._http.get(url);
  }

  getProjectsByCompanyId(id) {
    let url = this.baseUrl + '/Project/projects/' + id;
    return this._http.get(url);
  }
  getProject(id) {
    let url = this.baseUrl + '/Project/' + id;
    return this._http.get(url);
  }

  addProject(data) {
    let url = this.baseUrl + '/Project';
    return this._http.post(url, data);
  }

  editProject(project) {
    let url = this.baseUrl + '/Project/' + project.id;
    return this._http.put(url, project);
  }

  deleteProject(id) {
    let url = this.baseUrl + '/Project/' + id;
    return this._http.delete(url, id);
  }
  
};
