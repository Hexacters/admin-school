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
        const schoolData = JSON.parse(sessionStorage.getItem('by-school'));
        let data;
        if (schoolData && this.router.url.includes('bySchool')) {
            data = {
                schoolId: schoolData.id
            }
        }
        this._dataService.getDepartmentList(data).subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        });
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

    public gotoAdd() {
        if (!this.router.url.includes('bySchool')) {
            sessionStorage.setItem('by-school', null);
        }
        this.router.navigate(['department/add']);
    }

    goToProgramme(element) {
        sessionStorage.setItem('by-department', JSON.stringify(element));
        this.router.navigate(['programm/byDepartment']);
    }

    updateDepartment(element) {
        this.router.navigate(['department/edit'])
        sessionStorage.setItem('dprtmnt', JSON.stringify(element))
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


}
