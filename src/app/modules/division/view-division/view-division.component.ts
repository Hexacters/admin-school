import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';


@Component({
    selector: 'app-view-division',
    templateUrl: './view-division.component.html',
    styleUrls: ['./view-division.component.scss']
})
export class ViewDivisionComponent implements OnInit {


    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'semesterName', 'divisionName', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        const reqData = JSON.parse(sessionStorage.getItem('by-semester'));
        let data;
        if (reqData && this.router.url.includes('bySemester')) {
            data = {
                schoolId: reqData.schoolId,
                departmentId: reqData.departmentId,
                programId: reqData.programId,
                semesterId: reqData.id
            }
        }
        this._dataService.getDivisionList(data, req).subscribe(res => {
            console.log(res, 'res')
            this.dataSource = new MatTableDataSource(res.filter(e => !e.divisionAddition));
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteDivision(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteDivision(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });

    }

    public gotoAdd() {
        if (!this.router.url.includes('bySemester')) {
            sessionStorage.setItem('by-semester', null);
        }
        this.router.navigate(['division/add']);
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

    goToSemester(element) {
        const data = element;
        data.id = element.programId;
        sessionStorage.setItem('by-program', JSON.stringify(data));
        this.router.navigate(['semester/byProgramm']);
    }

    goToStudent(element) {
        sessionStorage.setItem('by-division', JSON.stringify(element));
        this.router.navigate(['students/byDivision']);
    }

    updateDivision(element) {
        this.router.navigate(['division/edit']);
        sessionStorage.setItem('division', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
