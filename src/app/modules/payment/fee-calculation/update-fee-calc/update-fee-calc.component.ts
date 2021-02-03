import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { FeeStatusComponent } from '../modal/fee-status/fee-status.component';
import { ScholarshipStatusComponent } from '../modal/scholarship-status/scholarship-status.component';

@Component({
    selector: 'app-update-fee-calc',
    templateUrl: './update-fee-calc.component.html',
    styleUrls: ['./update-fee-calc.component.scss']
})
export class UpdateFeeCalcComponent implements OnInit {

    public isEdit = true;
    public addMore: boolean = false;
    public isAdd: boolean = true;
    public editData: object = {};

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.editData = JSON.parse(sessionStorage.getItem('feeCalculation') || '{}');
        this.addMore = +this.editData['reasonAmount'] || this.editData['reason'];
        this.isAdd = this.editData['isAdd'];
        if (this.router.url.includes('view')) {
            this.isEdit = false;
        }

    }

    public updateValues() {
        this.addMore = !this.addMore;
        if (!this.addMore) {
            this.editData['reasonAmount'] = '0';
            this.editData['reason'] = '';
        }
    }

    public totalCalculatedAmount() {
        this.editData['netAmount'] = +this.editData['calculatedAmount'] - +this.editData['scholarShipAmount'];
        if (this.isAdd) {
            this.editData['netAmount'] += +this.editData['reasonAmount'] || 0;
        } else {
            this.editData['netAmount'] -= +this.editData['reasonAmount'] || 0;
        }

        if (+this.editData['netAmount'] < 0) {
            this.editData['netAmount'] = 0;
        }
        return this.editData['netAmount'];
    }

    public saveData() {
        this.editData['isAdd'] = this.isAdd
        this._dataService.updateFeeCalculation(this.editData).subscribe(e => {
            this.toastr.success('Fee details updated successfully', 'Info');
            this.router.navigate(['/fee-calculation']);
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.error, 'Info');
        });
    }

    public openFeeStatus() {
        const dialogRef = this.dialog.open(FeeStatusComponent, {
            width: '600px',
            data: {
                divisionId: this.editData['divisionId']
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    public openScholarStatus() {
        const dialogRef = this.dialog.open(ScholarshipStatusComponent, {
            width: '600px',
            data: {
                studentId: this.editData['studentId']
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

}
