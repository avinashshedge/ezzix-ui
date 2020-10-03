import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({providedIn: 'root'})
export class SharedProjectService {

  private dataSource = new BehaviorSubject<any>('');
  data = this.dataSource.asObservable();

  constructor() { }

  updatedProjectSelection(projectId){
    this.dataSource.next(projectId);
  }

}
