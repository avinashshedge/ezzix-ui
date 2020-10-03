import { Component, ViewChild, OnInit } from "@angular/core";
import { PresaleDashboardService } from "./presale-dashboard.service";
import { ApexAxisChartSeries, ApexChart,
   ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexXAxis, ApexFill,
   ApexTooltip, ApexStroke, ApexLegend, ApexGrid, ChartComponent } from "ng-apexcharts";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ProjectService } from "../../admin/project/project.service";
import { SharedProjectService } from "../../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";


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
	selector: 'app-pre-dashboard',
    templateUrl: './presale-dashboard.component.html'
})

export class PresaleDashboardComponent implements OnInit{
    leadStageData:any; leadsBySource:any;todaystask;timelinedata;tasksummary;
    period = 'All Time';
    @ViewChild('activityChart') chart: ChartComponent;
    public sourceChartOptions: Partial<SourceChartOptions>;
    public timelinechartOptions:Partial<TimelinechartOptions>;
    public taskSummaryChartOptions: Partial<SourceChartOptions>;

    displayedColumns = ['leadName','taskName', 'scheduledDate'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    openleads;
    openLeadDisplayedColumns = ['key','value'];
    openLeadsDataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) openLeadsSort:MatSort;
    @ViewChild('openLeadsPaginator', {static: true}) openLeadsPaginator: MatPaginator;

    topperformer;
    topPerformerDisplayedColumns = ['key','value'];
    topPerformerDataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) topPerformerSort:MatSort;
    @ViewChild('topPerformerPaginator', {static: true}) topPerformerPaginator: MatPaginator;

    leadage;
    leadAgeDisplayedColumns = ['key','value'];
    leadAgeDataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) leadAgeSort:MatSort;
    @ViewChild('leadAgePaginator', {static: true}) leadAgePaginator: MatPaginator;

    selectedProject;projects;
    role;

    constructor(private _service:PresaleDashboardService,private router: Router,
      private sharedService:SharedProjectService){
      this.role = localStorage.getItem('role').replace(/["']/g, "");
    }

    ngOnInit(): void {
     // this.getProjects();
      this.sharedService.data.subscribe(data => {
        if(data && (this.router.url == '/lead/dashboard' || this.router.url == '/lead')){
          this.selectedProject = data;
          localStorage.setItem('projectId',data);
          this.onProjectChange();
        }
      });
    }


    onProjectChange(){
      var projectId = this.selectedProject;

      this.getLeadStageData(projectId,'Monthly');
      this.getLeadsBySource(projectId,'Monthly');
      this.getTodaysTask(projectId);
      this.getTimeLine(projectId,'Monthly');
      this.getTaskSummary(projectId,'Monthly');

      if(this.role == 'Pre Sale Manager'){
        this.getOpenLeadsByAgent(projectId,'Monthly');
        this.getTopPerformer(projectId,'Monthly');
        this.getLeadsByAge(projectId,'Monthly');
      }
      // this.getOpenLeadsByAgent(projectId);
      // this.getTopPerformer(projectId);
      // this.getLeadsByAge(projectId);
    }

    getOpenLeadsByAgent(projectId,period){
      this._service.getOpenLeadsByAgent(projectId,period).subscribe(res=>{
        this.openleads = res;
        this.openLeadsDataSource = new MatTableDataSource<any>(this.openleads);
        this.openLeadsDataSource.sort = this.openLeadsSort;
        this.openLeadsDataSource.paginator = this.openLeadsPaginator;
      })
    }

    getTopPerformer(projectId,period){
      this._service.getTopPerformer(projectId,period).subscribe(res=>{
        this.topperformer = res;
        this.topPerformerDataSource = new MatTableDataSource<any>(this.topperformer);
        this.topPerformerDataSource.sort = this.topPerformerSort;
        this.topPerformerDataSource.paginator = this.topPerformerPaginator;
      })
    }

    getLeadsByAge(projectId,period){
      this._service.getLeadsByAge(projectId,period).subscribe(res=>{
        this.leadage = res;
        this.leadAgeDataSource = new MatTableDataSource<any>(this.leadage);
        this.leadAgeDataSource.sort = this.leadAgeSort;
        this.leadAgeDataSource.paginator = this.leadAgePaginator;
      })
    }

    getTaskSummary(projectId,period){
      this._service.getLeadTaskSummary(projectId,period).subscribe(res=>{
        this.tasksummary = res;
        this.loadTaskSummaryChart();
      });
    }

    loadTaskSummaryChart(){
      this.taskSummaryChartOptions = {
        series: this.tasksummary.series,
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
            categories: this.tasksummary.categories
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

    getTimeLine(projectId,period){
      this._service.getLeadCreationData(projectId,period).subscribe(res => {
        this.timelinedata = res;
        this.loadTimeLineChart();
      });
    }

    loadTimeLineChart(){
      this.timelinechartOptions = {
        series: this.timelinedata.series,
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
          categories:this.timelinedata.categories
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      };


    }

    getTodaysTask(projectId){
      this._service.getTodaysTask(projectId).subscribe(res=>{
        this.todaystask = res;
        this.dataSource = new MatTableDataSource<any>(this.todaystask);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

    getLeadsBySource(projectId,period){
      this._service.getLeadsBySource(projectId,period).subscribe(res =>{
        this.leadsBySource = res;
        this.loadSourceChart();
      })
    }

    loadSourceChart(){

      this.sourceChartOptions = {
        series: this.leadsBySource.series,
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
            categories: this.leadsBySource.categories
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

    getLeadStageData(projectId,period){
        this._service.getLeadStageData(projectId,period).subscribe(
          res => {
            this.leadStageData = res;
          }
        );
    }
}
