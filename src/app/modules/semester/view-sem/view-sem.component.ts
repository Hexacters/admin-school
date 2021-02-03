import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-view-sem',
    templateUrl: './view-sem.component.html',
    styleUrls: ['./view-sem.component.scss']
})
export class ViewSemComponent implements OnInit {

    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'semesterName', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        const reqData = JSON.parse(sessionStorage.getItem('by-program'));
        let data;
        if (reqData && this.router.url.includes('byProgramm')) {
            data = {
                schoolId: reqData.schoolId,
                departmentId: reqData.departmentId,
                programId: reqData.id
            }
        }
        this._dataService.getsemesterList(data).subscribe(res => {
            console.log(res, 'res')
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteProgramme(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteSemester(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });
    }

    public gotoAdd() {
        debugger
        if (!this.router.url.includes('byProgramm')) {
            sessionStorage.setItem('by-program', null);
        }
        this.router.navigate(['semester/add']);
    }

    goToDepartment(element) {
        sessionStorage.setItem('by-school', JSON.stringify({id: element.schoolId}));
        this.router.navigate(['department/bySchool']);
    }

    goToProgramName(element) {
        const data = element;
        data.id = element.departmentId;
        sessionStorage.setItem('by-department', JSON.stringify(data));
        this.router.navigate(['programm/byDepartment']);
    }

    goToDivision(element) {
        sessionStorage.setItem('by-semester', JSON.stringify(element));
        this.router.navigate(['division/bySemester']);
    }

    updateDepartment(element) {
        this.router.navigate(['semester/edit']);
        sessionStorage.setItem('semester', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
