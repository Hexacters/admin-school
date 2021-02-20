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
    selector: 'app-fee-typeview',
    templateUrl: './fee-typeview.component.html',
    styleUrls: ['./fee-typeview.component.scss']
})
export class FeeTypeviewComponent implements OnInit {

    displayedColumns: string[] = ['index', 'name', 'update', 'delete'];
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
        this._dataService.getFeetypeList(req).subscribe(res => {
            const result = res.filter(e => !!e.id);
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
        })
    }

    deleteSchool(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteFeeType(id).subscribe(res => {
                    this.ngOnInit();
                }, (res: HttpErrorResponse) => {
                    console.log(res)
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        });

    }

    updateFeeType(element) {
        this.router.navigate(['feeType/edit'])
        sessionStorage.setItem('feeType', JSON.stringify(element))
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
