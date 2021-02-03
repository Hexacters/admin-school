import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

interface IDialogData {
    studentId: string;
}

@Component({
    selector: 'app-scholarship-status',
    templateUrl: './scholarship-status.component.html',
    styleUrls: ['./scholarship-status.component.scss']
})
export class ScholarshipStatusComponent implements OnInit {


    displayedColumns: string[] = ['index', 'scholarshipName', 'typeName'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

    paginator: MatPaginator;

    @ViewChild('matPaginator', { static: false }) set setPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    constructor(
        public dialogRef: MatDialogRef<ScholarshipStatusComponent>,
        private _dataService: UtilityServiceService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: IDialogData
    ) { }

    ngOnInit() {
        this.getFeeDetails();
    }

    public getFeeDetails() {
        this._dataService.getScholarshipBreakUp(this.data).subscribe((data) => {
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
