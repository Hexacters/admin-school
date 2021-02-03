import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  public studentData: any = {}
  public userDetails: any = {}
  constructor(
    private _dataService: UtilityServiceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.getStudentById(this.userDetails.userId);
  }

  public getStudentById(id: number) {
    this._dataService.getStudentById(id).subscribe(e => {
      this.studentData = e;
    })
  }

}
