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

        this._dataService.getDivisionList().subscribe(res => {
            console.log(res, 'res')
            this.dataSource = new MatTableDataSource(res);
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

    updateDivision(element) {
        this.router.navigate(['division/edit']);
        sessionStorage.setItem('division', JSON.stringify(element));
    }


}
