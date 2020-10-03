import { Component, OnInit, ViewChild } from "@angular/core";
import { MarketingService } from "../marketing.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs/operators";

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
  selector: 'page-detail',
  templateUrl: './page-detail.component.html'
})

export class PageDetailComponent implements OnInit {
  pageDetails;pageId;

  displayedColumns = ['name', 'emailId','mobileNumber','stage','createdDate'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private marketingService:MarketingService,private activatedRoute: ActivatedRoute){
    this.activatedRoute.params.subscribe(params => this.pageId = params['id']);
  }

  ngOnInit(): void {
    this.getPageDetails()
  }

  getPageDetails(){
    this.marketingService.getPageDetail(this.pageId).subscribe(res => {
      this.pageDetails = res;
      this.loadChart(this.pageDetails.chartData);
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
