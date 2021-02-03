import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-view-programme',
    templateUrl: './view-programme.component.html',
    styleUrls: ['./view-programme.component.scss']
})


export class ViewProgrammeComponent implements OnInit {

    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        const schoolData = JSON.parse(sessionStorage.getItem('by-department'));
        let data;
        if (schoolData && this.router.url.includes('byDepartment')) {
            data = {
                schoolId: schoolData.schoolId,
                departmentId: schoolData.id
            }
        }

        this._dataService.getProgrammeList(data).subscribe(res => {
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
                this._dataService.deleteProgramme(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });

    }

    public gotoAdd() {
        if (!this.router.url.includes('byDepartment')) {
            sessionStorage.setItem('by-department', null);
        }
        this.router.navigate(['programm/add']);
    }

    goToDepartment(element) {
        sessionStorage.setItem('by-school', JSON.stringify({id: element.schoolId}));
        this.router.navigate(['department/bySchool']);
    }

    goToSemester(element) {
        sessionStorage.setItem('by-program', JSON.stringify(element));
        this.router.navigate(['semester/byProgramm']);
    }

    updateDepartment(element) {
        this.router.navigate(['programm/edit']);
        sessionStorage.setItem('programm', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


}
