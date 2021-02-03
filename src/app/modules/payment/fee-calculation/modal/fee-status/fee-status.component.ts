import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

interface IDialogData {
    divisionId: string;
}

@Component({
    selector: 'app-fee-status',
    templateUrl: './fee-status.component.html',
    styleUrls: ['./fee-status.component.scss']
})
export class FeeStatusComponent implements OnInit {

    displayedColumns: string[] = ['index', 'type', 'feeType', 'fee'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

    paginator: MatPaginator;

    @ViewChild('matPaginator', { static: false }) set setPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    constructor(
        public dialogRef: MatDialogRef<FeeStatusComponent>,
        private _dataService: UtilityServiceService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: IDialogData
    ) { }

    ngOnInit() {
        console.log(this.data.divisionId);
        this.getFeeDetails();
    }

    public getFeeDetails() {
        this._dataService.getFeeBreakup(this.data).subscribe((data) => {
            data = this.getTotal(data);
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
    }

    public getTotal(data) {
        const total = {
            isTotal: true,
            feeType: "Total",
            fee: 0
        }
        data.forEach(e => {
            total.fee += +e.fee;
        });

        data.push(total);
        return data;
    }
}
