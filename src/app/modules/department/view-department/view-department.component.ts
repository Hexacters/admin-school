import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';


@Component({
    selector: 'app-view-department',
    templateUrl: './view-department.component.html',
    styleUrls: ['./view-department.component.scss']
})
export class ViewDepartmentComponent implements OnInit {
    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(private _dataService: UtilityServiceService, private router: Router) { }

    ngOnInit() {

        this._dataService.getDepartmentList().subscribe(res => {
            console.log(res, 'res')
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteDepartment(id) {
        this._dataService.deleteDepartment(id).subscribe(res => {
            this.ngOnInit();
        });
    }

    updateDepartment(element) {
        this.router.navigate(['department/edit'])
        sessionStorage.setItem('dprtmnt', JSON.stringify(element))
    }


}
