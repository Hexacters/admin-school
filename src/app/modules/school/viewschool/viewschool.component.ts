import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LocalcommunicationService } from 'src/app/core/localcommunication.service';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-viewschool',
  templateUrl: './viewschool.component.html',
  styleUrls: ['./viewschool.component.scss']
})


export class ViewschoolComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'update', 'delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private _dataService: UtilityServiceService,
     private router: Router,
     private _localCommunication:LocalcommunicationService
     ) {
      // this._localCommunication.schoolFlag.subscribe()
      this._localCommunication.schoolData.subscribe();
     }

  ngOnInit() {
    // this._localCommunication.schoolFlag.ne
    this._dataService.getSchoolList().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
  }

  deleteSchool(id) {
    this._dataService.deleteSchool(id).subscribe(res => {
      this.ngOnInit();
    });
  }

  updateSchool(element) {
    // this._dataService.updateSchool(element.id,element.schoolName).subscribe(res=>{
    //   this.ngOnInit;
    // })
    // this._localCommunication.schoolFlag.next(true);
    console.log(element)
    // this._localCommunication.schoolData.next(element);
    localStorage.setItem('school',JSON.stringify(element));
    setTimeout(() => {
      this.router.navigate(['school/edit'])
    }, 1000);
    
  }


}
