import { Component, ViewChild, OnInit } from '@angular/core';

import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexLegend,
    ApexTooltip,
    ApexNonAxisChartSeries,
    ApexResponsive
} from 'ng-apexcharts';
import { AdminDashboardService } from './admin-dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectService } from '../project/project.service';


export type ActiveUserChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    tooltip: ApexTooltip;
    legend: ApexLegend;
    colors: string[];
    stroke: any;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
};


@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

    @ViewChild('activeusers-chart') chart2: ChartComponent;
    public ActiveUserChartOptions: Partial<ActiveUserChartOptions>;

    displayedColumns = ['key', 'value'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    emailCredits;
    smsCredits;
    loginDisplayedColumns = ['key', 'value'];
    loginDataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) loginSort:MatSort;
    @ViewChild('loginPaginator', {static: true}) loginPaginator: MatPaginator;

    projects;projectwiseUsers;loginleaderboard;selectedProject;
    constructor(private service:AdminDashboardService,private projectService:ProjectService){
    }
    ngOnInit(): void {
      this.getSmsCredits();
        this.getEmailCredits();
        this.getLoginLeaderboard("all");
        this.getProjectwiseUsers();
        this.getActiveDeactiveUsers("all");
        //this.getProjects()
    }
    getProjects(){
        this.projectService.getAllProject().subscribe(res => {
            this.projects = res;
            this.selectedProject = this.projects.map(i => i.id);
        });
    }
    getEmailCredits(){
      this.service.getEmailCredits().subscribe(res => {
        this.emailCredits = res;
      });
    }

    getSmsCredits(){
      this.service.getSmsCredits().subscribe((res:any) => {
        this.smsCredits = res.credit;
      });
    }
    onProjectChange(){
        var projectId = this.selectedProject.join();
        this.getLoginLeaderboard(projectId);
        this.getActiveDeactiveUsers(projectId);
    }

    getProjectwiseUsers(){
        this.service.getProjectwiseUsers().subscribe(res=>{
            this.projectwiseUsers = res;
            this.dataSource = new MatTableDataSource<any>(this.projectwiseUsers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getLoginLeaderboard(projectId){
        this.service.getLoginLeaderboard(projectId).subscribe(res=>{
            this.loginleaderboard = res;
            this.loginDataSource = new MatTableDataSource<any>(this.loginleaderboard);
            this.loginDataSource.paginator = this.loginPaginator;
            this.loginDataSource.sort = this.loginSort;
        });
    }

    getActiveDeactiveUsers(projectId){
        this.service.getActiveDeactiveUsers(projectId).subscribe(res =>{
            this.loadActiveDeactiveChart(res);
        });

    }

    loadActiveDeactiveChart(series){
        this.ActiveUserChartOptions = {
            series: series,
            chart: {
                type: 'pie',
                height: 290
            },

            tooltip: {
                fillSeriesColor: false,
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return opts.w.config.series[opts.seriesIndex]
                },
            },
            stroke: {
                width: 0
            },
            legend: {
                position: 'bottom',
                show: true,
            },
            labels: ['Active', 'Deactive'],
            colors: ['#1e88e5', '#eceff1'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        }
                    }
                }
            ]
        };
    }


}
