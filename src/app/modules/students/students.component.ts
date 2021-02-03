import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'firstName', 'lastName', 'emailId', 'phoneNo', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        const reqData = JSON.parse(sessionStorage.getItem('by-division'));
        let data;
        if (reqData && this.router.url.includes('byDivision')) {
            data = {
                schoolId: reqData.schoolId,
                departmentId: reqData.departmentId,
                programId: reqData.programId,
                semesterId: reqData.semesterId,
                divisionId: reqData.id
            }
        }
        this._dataService.getStudent(data).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.filter(e => e.id));
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteStudent(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteStudent(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });
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

    updateStudent(element) {
        this.router.navigate(['students/edit']);
        sessionStorage.setItem('students', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
