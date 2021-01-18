import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-update-fee-calc',
    templateUrl: './update-fee-calc.component.html',
    styleUrls: ['./update-fee-calc.component.scss']
})
export class UpdateFeeCalcComponent implements OnInit {

    public isEdit = true;
    public editData: object = {};

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.editData = JSON.parse(sessionStorage.getItem('feeCalculation') || '{}');
        if (this.router.url.includes('view')) {
            this.isEdit = false;
        }

    }

    public totalCalculatedAmount() {
        this.editData['netAmount'] = +this.editData['calculatedAmount'] - +this.editData['scholarShipAmount'];
        if (+this.editData['netAmount'] < 0) {
            this.editData['netAmount'] = 0;
        }
        return this.editData['netAmount'];
    }

    public saveData() {
        this._dataService.updateFeeCalculation(this.editData).subscribe(e => {
            this.toastr.success('Fee details updated successfully', 'Info');
            this.router.navigate(['/fee-calculation']);
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.error, 'Info');
        });
    }

}
