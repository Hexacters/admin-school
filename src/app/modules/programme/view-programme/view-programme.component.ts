import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-view-programme',
  templateUrl: './view-programme.component.html',
  styleUrls: ['./view-programme.component.scss']
})


export class ViewProgrammeComponent implements OnInit {

  displayedColumns: string[] = ['index', 'schoolName','departmentName','programName','update','delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private _dataService:UtilityServiceService,
    private router: Router 
  ) { }

  ngOnInit() {
   
    this._dataService.getProgrammeList().subscribe(res=>{
      console.log(res,'res')
      this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
  }

  deleteDepartment(id){
    this._dataService.deleteProgramme(id).subscribe(res=>{
      this.ngOnInit();
    });
  }

  updateDepartment(element) {
    this.router.navigate(['programm/edit'])
    sessionStorage.setItem('programm', JSON.stringify(element))
}


}
