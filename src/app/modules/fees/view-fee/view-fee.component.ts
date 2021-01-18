import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-view-fee',
    templateUrl: './view-fee.component.html',
    styleUrls: ['./view-fee.component.scss']
})
export class ViewFeeComponent implements OnInit {


    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'semesterName', 'divisionName', 'type', 'fee', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this._dataService.getFee().subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        })
    }

    ngAfterViewInit() {
    }

    deleteFee(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteFee(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });
    }

    updateFee(element) {
        this.router.navigate(['fee/edit']);
        sessionStorage.setItem('fees', JSON.stringify(element));
    }


}
