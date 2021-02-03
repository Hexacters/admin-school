import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';
import * as moment from 'moment';

@Component({
    selector: 'app-active-fee-modal',
    templateUrl: './active-fee-modal.component.html',
    styleUrls: ['./active-fee-modal.component.scss']
})
export class ActiveFeeModalComponent implements OnInit {

    public minDate: Date = moment().startOf('day').toDate();
    public penalty = [];
    public objectForm: FormGroup;

    constructor(
        private _dataService: UtilityServiceService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<ActiveFeeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'penaltyId': new FormControl('', Validators.required),
            'activationDate': new FormControl(moment().startOf('day').toDate(), Validators.required),
            'activateFee': new FormControl(true, Validators.required),
        });
        this.getPenality();
    }

    getPenality(): void {
        this._dataService.getPenalty().subscribe(res => {
            this.penalty = [...res];
        });
    }

    onSubmit() {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            this.dialogRef.close(this.objectForm.value)
        }

    }

}
