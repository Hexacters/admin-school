import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActiveFeeService } from '../../active-fee/active-fee.service';

@Component({
    selector: 'app-student-status',
    templateUrl: './student-status.component.html',
    styleUrls: ['./student-status.component.scss']
})
export class StudentStatusComponent {

    public studentData: any = {};
    public price: any = {};

    public paymentList = [];
    public activeFee = [];
    public feeList = [];
    public feeBreakup = [];
    public schBreakup = [];
    public isPaymentView: boolean = false;
    public selectedFee = [];
    public user: any = {};
    public paymentMode: string = '';

    constructor(
        public dialogRef: MatDialogRef<StudentStatusComponent>,
        public activeFeeService: ActiveFeeService,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    submitData(data) {
        this.dialogRef.close(data);
    }
}
