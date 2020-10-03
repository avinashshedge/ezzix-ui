import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({"providedIn":"root"})
export class MarketingDashboardService {
  public baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }

  getLeadSourceData(period) {
    let url = this.baseUrl + '/marketing/sources?period=' + period;
    return this.http.get(url);
  }

  getLeadCreationData() {
    let url = this.baseUrl + '/marketing/leadcreation';
    return this.http.get(url);
  }

  getFacebookAdsData(period) {
    let url = this.baseUrl + '/marketing/facebook-ads?period=' + period;
    return this.http.get(url);
  }

  getLandingPageDetails(period){    
    let url = this.baseUrl + '/marketing/landing-pages?period=' + period;
    return this.http.get(url);
  }

  getMarketingKPI(){    
    let url = this.baseUrl + '/marketing/marketing-kpi';
    return this.http.get(url);
  }
  
}