import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({providedIn: 'root'})
export class NotificatioDataService {

  private dataSource = new BehaviorSubject<any>('');
  data = this.dataSource.asObservable();

  constructor() { }

  updateNotification(message){
    this.dataSource.next(message);
  }

}
