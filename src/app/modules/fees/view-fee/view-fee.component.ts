import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-view-fee',
  templateUrl: './view-fee.component.html',
  styleUrls: ['./view-fee.component.scss']
})
export class ViewFeeComponent implements OnInit {

  
  displayedColumns: string[] = ['index', 'schoolName','departmentName','programName','semesterName','divisionName','type','fee','update','delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private _dataService:UtilityServiceService) { }

  ngOnInit() {
    this._dataService.getFee().subscribe(res=>{
      console.log(res,'res')
      this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
  }

  deleteDivision(id){
    this._dataService.deleteFee(id).subscribe(res=>{
      this.ngOnInit();
    });
  }

  updateDepartment(element){
    // this._dataService.updateDepartment(element.id,element.departmentName).subscribe(res=>{
    //   this.ngOnInit;
    // })
  }


}
