import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-scholarship',
    templateUrl: './scholarship.component.html',
    styleUrls: ['./scholarship.component.scss']
})
export class AssignScholarshipComponent implements OnInit {
    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'scholarshipName', 'studentName', 'rollNo', 'update', 'delete'];
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
        this._dataService.getAssignScholarship(req).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.filter(e => e.id));
            this.dataSource.paginator = this.paginator;
        });
    }

    public updatePriceCalculation(params) {
        this._dataService.updateScholarPriceCalculation(params).subscribe(res => { });
    }

    deleteScholarships(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteAssignScholarship(element.id).subscribe(res => {
                    this.updatePriceCalculation({
                        studentId: element.studentId,
                        divisionId: element.divisionId
                    })
                    this.ngOnInit();
                });
            }
        });
    }

    updateScholarships(element) {
        this.router.navigate(['assign/scholarship/edit']);
        sessionStorage.setItem('assignScholarsips', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
