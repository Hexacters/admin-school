import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this._dataService.getFeetypeList().subscribe(res => {
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
                });
            }
        });

    }

    updateFeeType(element) {
        this.router.navigate(['feeType/edit'])
        sessionStorage.setItem('feeType', JSON.stringify(element))
    }


}
