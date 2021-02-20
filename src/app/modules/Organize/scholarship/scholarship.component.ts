import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-scholarship',
    templateUrl: './scholarship.component.html',
    styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

    displayedColumns: string[] = ['index', 'typeName', 'scholarshipType', 'name', 'value', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getScholarship(req).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.filter(e => e.id !== 1));
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteScholarship(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteScholarship(id).subscribe(res => {
                    this.ngOnInit();
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        });
    }

    updateScholarship(element) {
        this.router.navigate(['scholarship/edit']);
        sessionStorage.setItem('scholarship', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
