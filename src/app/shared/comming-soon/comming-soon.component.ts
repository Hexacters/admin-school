import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.component.html',
  styleUrls: ['./comming-soon.component.scss']
})
export class CommingSoonComponent implements OnInit {

  @Input('isNoRecord') public isNoRecord: boolean;
  @Input('heading') public heading: string;
  @Input('content') public content: string;

  constructor() { }

  ngOnInit() {
  }

}
