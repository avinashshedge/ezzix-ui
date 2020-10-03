import { Component, OnInit } from '@angular/core';
import { NotificationSignalRService } from './NotificationSignalRService';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public signalRService: NotificationSignalRService, private http: HttpClient) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addNotificationDataListener();
  }

}
