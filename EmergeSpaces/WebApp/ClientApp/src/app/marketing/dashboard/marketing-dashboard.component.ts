import { Component, OnInit, ViewChild } from "@angular/core";
import { MarketingDashboardService } from "./marketing-dashboard.service";
import { ApexAxisChartSeries, ApexChart, ApexDataLabels,
        ApexPlotOptions, ApexYAxis, ApexXAxis, ApexFill,
        ApexTooltip, ApexStroke, ApexLegend, ApexGrid, ApexNonAxisChartSeries, ApexResponsive, ChartComponent }
        from "ng-apexcharts";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";

export type SourceChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
  };
  export type FBChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
  };

  export type TimelinechartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: any;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    colors: string[];
    markers: any;
    grid: ApexGrid;
  };


@Component({
	selector: 'app-marketing-dashboard',
    templateUrl: './marketing-dashboard.component.html'
})

export class MarketingDashboardComponent implements OnInit{
    kpiDetails;pageDetails;selectedProject;

    public sourceChartOptions: Partial<SourceChartOptions>;

    @ViewChild("fb-chart") chart: ChartComponent;
    public fbChartOptions: Partial<FBChartOptions>;
    public timelinechartOptions:Partial<TimelinechartOptions>;

    displayedColumns = ['name','y'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(  private dashboardService:MarketingDashboardService,
      private router:Router,private sharedProjectService:SharedProjectService){

    }

    ngOnInit(): void {
      this.sharedProjectService.data.subscribe(data => {
        if(data && (this.router.url == '/marketing' || this.router.url == '/marketing/dashboard')){
            this.selectedProject = data;
            localStorage.setItem('projectId',data);
            this.getMarketingKPI();
            this.getLeadCreationData();
            this.getLeadSourceData('Monthly');
            this.getFBAdsData('Monthly');
            this.getLandingPageDetails('Monthly');
        }
      });
    }

    getLandingPageDetails(period){
        this.dashboardService.getLandingPageDetails(period).subscribe(
          res => {
            this.pageDetails = res;
            this.dataSource = new MatTableDataSource<any>(this.pageDetails);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        );
    }

    getMarketingKPI(){
        this.dashboardService.getMarketingKPI().subscribe(
          res => {
            this.kpiDetails = res;
          }
        );
    }

    getLeadSourceData(period){
        this.dashboardService.getLeadSourceData(period).subscribe(
          res => {
            this.loadLeadSourceChart(res);
          }
        );
    }

    loadLeadSourceChart(data){
        this.sourceChartOptions = {
            series: data.series,
            chart: {
              type: "bar",
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '30%',
                endingShape: 'flat'
              }
            },
            grid: {
                borderColor: 'rgba(0,0,0,.2)',
                strokeDashArray: 3,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: data.categories
            },

            legend: {
                show: false,
            },
            fill: {
                colors: ['#26c6da', '#1e88e5'],
                opacity: 1
            },
            tooltip: {
                fillSeriesColor: false,
                marker: {
                  show: false,
                },
            }
        };
    }

    getFBAdsData(period){
        this.dashboardService.getFacebookAdsData(period).subscribe(
          res => {
            this.loadFBAdsChart(res);
          }
        );
    }

    loadFBAdsChart(data){

        this.fbChartOptions = {
            series: data.series,
            chart: {
              width: 380,
              type: "pie"
            },
            labels: data.labels,
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

    getLeadCreationData(){
        this.dashboardService.getLeadCreationData().subscribe(
          res => {
            this.loadTimeSeries(res);
          }
        );
    }

    loadTimeSeries(data){
        this.timelinechartOptions = {
            series: data.series,
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: data.categories
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
    }
}
