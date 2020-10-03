import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class HeaderService {
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotification() {
    return this.http.get(this.baseUrl + '/notification');
  }
}
