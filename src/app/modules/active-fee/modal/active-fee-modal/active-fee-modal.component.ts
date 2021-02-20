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
    public terms: number[] = [];
    public objectForm: FormGroup;

    constructor(
        private _dataService: UtilityServiceService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<ActiveFeeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'term': new FormControl('', Validators.required),
            'penaltyId': new FormControl('', Validators.required),
            'activationDate': new FormControl(moment().startOf('day').toDate(), Validators.required),
            'activateFee': new FormControl(true, Validators.required),
        });
        const req = {
            divisionId: this.data.others && this.data.others.divisionId,
            feeTypeId: this.data.others && this.data.others.feeTypeId || this.data.others.id
        }
        this._dataService.getTerms(req).subscribe((e: number[]) => {
            this.terms = e;
        });
        this.getPenality();
    }

    getPenality(): void {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getPenalty(req).subscribe(res => {
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
