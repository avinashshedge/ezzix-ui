import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from './../environments/environment'
import { NotificatioDataService } from './layouts/full/service/notification-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalRService {
  public baseUrl = environment.notificationUrl;

  constructor(private notificatioData: NotificatioDataService){

  }

  newMessage(message) {
    this.notificatioData.updateNotification(message)
  }

private hubConnection: signalR.HubConnection
  public startConnection = () => {
    let hub_url = this.baseUrl;
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(hub_url + '/notification',{
                              skipNegotiation: true,
                              transport: signalR.HttpTransportType.WebSockets
                            })
                            .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addNotificationDataListener = () => {
    this.hubConnection.on('BroadcastMessage', (data) => {
      if(data.userId == localStorage.getItem('userId'))
        {
          this.newMessage(data);
        }
    });
  }
}
