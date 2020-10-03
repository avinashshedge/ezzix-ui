import { Component, OnInit,ViewChild } from "@angular/core";
import { ProjectService } from "../../admin/project/project.service";
import { SaleDashboardService } from "./sales-dashboard.service";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

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


@Component({
  selector: "app-sales-dashboard",
  templateUrl: "./sales-dashboard.component.html",
})
export class SalesDashboardComponent implements OnInit {
  projects;
  selectedProject;

  @ViewChild("sales-growth-chart") salesGrowthChart: ChartComponent;
  public salesGrowthChartOptions: Partial<ChartOptions>;
  public sourceChartOptions: Partial<SourceChartOptions>;
  public leadFlowChartOptions:Partial<SourceChartOptions>;
  tasksummary: any;leadStageData;salesAnalyticsData;

  displayedColumns = ['key','value'];
  openLeadData = new MatTableDataSource<Element>();
  @ViewChild(MatSort) openLeadSort:MatSort;
  @ViewChild('openLeadPaginator', {static: true}) openLeadPaginator: MatPaginator;

  agedLeadData = new MatTableDataSource<Element>();
  @ViewChild(MatSort) agedLeadSort:MatSort;
  @ViewChild('agedLeadPaginator', {static: true}) agedLeadPaginator: MatPaginator;

  conversionData = new MatTableDataSource<Element>();
  @ViewChild(MatSort) conversionSort:MatSort;
  @ViewChild('conversionPaginator', {static: true}) conversionPaginator: MatPaginator;

  wonData = new MatTableDataSource<Element>();
  @ViewChild(MatSort) wonSort:MatSort;
  @ViewChild('wonPaginator', {static: true}) wonPaginator: MatPaginator;

  role;
  constructor(private router:Router,
    private sharedService:SharedProjectService,
    private service:SaleDashboardService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role').replace(/["']/g, "");

    this.sharedService.data.subscribe(data => {
      if(data && (this.router.url == '/sales/dashboard' || this.router.url == '/sales')){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.onProjectChange();
      }
    });
    //this.getProjects();
  }

  onProjectChange() {
    this.getSalesGrowthData();
    this.getLeadFlowData();
    this.getLeadStageData("Monthly");
    this.getLeadsBySource('Monthly');
    this.getTaskSummary('Monthly');
    this.getSalesAnalyticsData('Monthly');

    if(this.role == "Sales Manager"){
      this.getOpenLeadData();
      this.getAgedLeadData();
      this.getTopPerfomerConversionData();
      this.getTopPerfomerWonData();
    }
  }

  getOpenLeadData(){
    this.service.getOpenLeadData(this.selectedProject).subscribe(res =>{
      let data:any = res;
      this.openLeadData = new MatTableDataSource<any>(data);
      this.openLeadData.sort = this.openLeadSort;
      this.openLeadData.paginator = this.openLeadPaginator;
    });
  }
  getTopPerfomerConversionData(){
    this.service.getTopPerfomerConversionData(this.selectedProject).subscribe(res =>{
      let data:any = res;
      this.conversionData = new MatTableDataSource<any>(data);
      this.conversionData.sort = this.conversionSort;
      this.conversionData.paginator = this.conversionPaginator;

    });
  }
  getTopPerfomerWonData(){
    this.service.getTopPerfomerWonData(this.selectedProject).subscribe(res =>{
      let data:any = res;
      this.wonData = new MatTableDataSource<any>(data);
      this.wonData.sort = this.wonSort;
      this.wonData.paginator = this.wonPaginator;
    });
  }
  getAgedLeadData(){
    this.service.getAgedLeadData(this.selectedProject).subscribe(res =>{
      let data:any = res;
      this.agedLeadData = new MatTableDataSource<any>(data);
      this.agedLeadData.sort = this.agedLeadSort;
      this.agedLeadData.paginator = this.agedLeadPaginator;
    });
  }

  getLeadStageData(period){
    this.service.getLeadStageData(this.selectedProject,period).subscribe(res =>{
      this.leadStageData = res;
    });
  }

  getSalesAnalyticsData(period){
    this.service.getSalesAnalyticsData(this.selectedProject,period).subscribe(res =>{
      this.salesAnalyticsData = res;
    });
  }

  getTaskSummary(period){
    this.service.getTaskSummary(this.selectedProject,period).subscribe(res =>{
      this.tasksummary = res;
    })
  }

  getSalesGrowthData(){
    var projectId = this.selectedProject;
    this.service.getSalesGrowthData(projectId).subscribe(res=> {
      this.loadSaleGrowthChart(res);
    });
  }

  loadSaleGrowthChart(data){
    this.salesGrowthChartOptions = {
      series:data.series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: data.categories
      },
      yaxis: {
        title: {
          text: "Lead Count"
        }
      },
      fill: {
        opacity: 1
      }
    };
  }

  getLeadFlowData(){
    var projectId = this.selectedProject;
    this.service.getLeadFlowData(projectId).subscribe(res=> {
      this.loadLeadFlowChart(res);
    });
  }

  loadLeadFlowChart(data){
    this.leadFlowChartOptions = {
      series:data.series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: data.categories
      },
      yaxis: {
        title: {
          text: "Lead Count"
        }
      },
      fill: {
        opacity: 1
      }
    };
  }

  getLeadsBySource(period){
    this.service.getLeadsBySource(this.selectedProject,period).subscribe(res =>{
      let sourceData = res;
      this.loadSourceChart(sourceData);
    })
  }

  loadSourceChart(data){

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
}
