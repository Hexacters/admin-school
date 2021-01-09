import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-view-sem',
  templateUrl: './view-sem.component.html',
  styleUrls: ['./view-sem.component.scss']
})
export class ViewSemComponent implements OnInit {

  displayedColumns: string[] = ['index', 'schoolName','departmentName','programName','semesterName','update','delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private _dataService:UtilityServiceService) { }

  ngOnInit() {
    this._dataService.getsemesterList().subscribe(res=>{
      console.log(res,'res')
      this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
  }

  deleteProgramme(id){
    this._dataService.deleteSemester(id).subscribe(res=>{
      this.ngOnInit();
    });
  }

  updateDepartment(element){
    // this._dataService.updateDepartment(element.id,element.departmentName).subscribe(res=>{
    //   this.ngOnInit;
    // })
  }


}
