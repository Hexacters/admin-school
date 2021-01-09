import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalcommunicationService {

  schoolData = new Subject<any>();
  constructor() { }

}
