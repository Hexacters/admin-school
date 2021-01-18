import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
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

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

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
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteDepartment(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
          });
        
    }

    updateDepartment(element) {
        this.router.navigate(['department/edit'])
        sessionStorage.setItem('dprtmnt', JSON.stringify(element))
    }


}
