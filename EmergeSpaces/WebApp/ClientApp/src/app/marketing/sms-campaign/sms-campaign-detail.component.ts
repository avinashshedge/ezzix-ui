import { Component, OnInit, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";

import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'sms-campaign-detail',
  templateUrl: './sms-campaign-detail.component.html'
})

export class SMSCampaignDetailComponent implements OnInit {
  campaign;campaignId;

  displayedColumns = ['fullName', 'mobileNumber','emailId','status'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private marketingService:MarketingService,private activatedRoute: ActivatedRoute){
    this.activatedRoute.params.subscribe(params => this.campaignId = params['id']);
  }

  ngOnInit(): void {
    this.getCampaignDetails()
  }

  getCampaignDetails(){
    this.marketingService.getSMSCampaign(this.campaignId).subscribe(res => {
      this.campaign = res;
      this.dataSource = new MatTableDataSource<any>(this.campaign.recipients);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.loadChart(this.campaign.chartData);
    });
  }

  loadChart(chartData){
    this.chartOptions = {
      series: chartData.map(i=>i.y),
      chart: {
        width: 380,
        type: "pie"
      },
      labels: chartData.map(i=>i.name),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

}
