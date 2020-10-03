import { OnInit, Component } from "@angular/core";
import { CPService } from "./cp.service";
import { SharedProjectService } from "../layouts/full/service/shared-project.service";
import { Router } from "@angular/router";
import { ApexAxisChartSeries, ApexXAxis, ApexChart, ApexTooltip, ApexDataLabels, ApexLegend, ApexGrid } from "ng-apexcharts";

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
  	selector: 'app-cp-dashboard',
    templateUrl: './cp-dashboard.component.html'
})

export class CPDashboardComponent implements OnInit{
  leadStageData;
  public timelinechartOptions:Partial<TimelinechartOptions>;
  timelinedata; selectedProject;period;
  constructor(private service:CPService,
    private router:Router,
    private sharedService:SharedProjectService){}

  ngOnInit(): void {
    this.sharedService.data.subscribe(data => {
      if(data && (this.router.url == '/cp/cp-dashboard' || this.router.url == '/cp')){
        this.selectedProject = data;
        localStorage.setItem('projectId',data);
        this.onProjectChange();
      }
    });

  }

  onProjectChange(){
    var projectId = this.selectedProject;
    this.getCPLeadStageData(projectId,'Monthly');
    this.getTimeLine(projectId,'Monthly');
  }
  getCPLeadStageData(projectId,period){

    this.service.getCPLeadStageData(projectId,period).subscribe(
      res => {
        this.leadStageData = res;
      }
    );
  }

  getTimeLine(projectId,period){
    this.service.getLeadCreationData(projectId,period).subscribe(res => {
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


}
