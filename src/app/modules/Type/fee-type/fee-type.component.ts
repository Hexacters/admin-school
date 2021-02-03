import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    selector: 'app-fee-type',
    templateUrl: './fee-type.component.html',
    styleUrls: ['./fee-type.component.scss']
})
export class FeeTypeComponent implements OnInit {

    public objectForm: FormGroup;
    public feeTypeList: Array<any> = [{}];
    public isEdit: boolean = false;
    public editData;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'feeTypes': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.editData = JSON.parse(sessionStorage.getItem('feeType'));
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(this.editData.typeName, Validators.required));
        } else {
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(null, Validators.required));
        }
    }

    addFeeType() {
        this.feeTypeList.push({});
        (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(null, Validators.required));
    }

    removeFeeType(i) {
        this.feeTypeList.splice(i, 1);
        (<FormArray>this.objectForm.get('feeTypes')).removeAt(i);
    }

    onSubmit() {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            if (this.isEdit) {
                const typeName = this.objectForm.value.feeTypes[0];
                this._dataService.updateFeetype(this.editData.id, typeName).subscribe(res => {
                    this.toastr.success('Fees Type updated successfully', 'Info');
                    this.router.navigate(['/feeType']);
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.saveFeetype(this.objectForm.value.feeTypes).subscribe(res => {
                    this.toastr.success('Fees Type Saved successfully', 'Info');
                    this.router.navigate(['/feeType']);
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }
    }

}
