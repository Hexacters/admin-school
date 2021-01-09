import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-fee-typeview',
    templateUrl: './fee-typeview.component.html',
    styleUrls: ['./fee-typeview.component.scss']
})
export class FeeTypeviewComponent implements OnInit {

    displayedColumns: string[] = ['index', 'name', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(private _dataService: UtilityServiceService) { }

    ngOnInit() {

        this._dataService.getFeetypeList().subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteSchool(id) {
        this._dataService.deleteFeeType(id).subscribe(res => {
            this.ngOnInit();
        });
    }

    updateSchool(element) {
        // this._dataService.updateSchool(element.id,element.schoolName).subscribe(res=>{
        //   this.ngOnInit;
        // })
    }


}
