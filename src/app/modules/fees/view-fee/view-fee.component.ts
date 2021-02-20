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
    selector: 'app-view-fee',
    templateUrl: './view-fee.component.html',
    styleUrls: ['./view-fee.component.scss']
})
export class ViewFeeComponent implements OnInit {


    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'feeType', 'frequencyStop', 'type', 'fee', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService,
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
        this._dataService.getFee(req).subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        })
    }

    updateFeeCalculation(data) {
        this._dataService.updatePriceCalculation(data).subscribe(res => {
            // Success
        });
    }

    deleteFee(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteFee(element.id).subscribe(res => {
                    this.updateFeeCalculation({
                        ...element
                    })
                    this.ngOnInit();
                }, (res: HttpErrorResponse) => {
                    console.log(res)
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        });
    }

    updateFee(element) {
        this.router.navigate(['fee/edit']);
        sessionStorage.setItem('fees', JSON.stringify(element));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
