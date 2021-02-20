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
    public universityList: Array<any> = [{}];
    public isEdit: boolean = false;
    public isSUadmin: boolean = false;
    public editData;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.isSUadmin = this._dataService.isSuperAdmin();
        const id = this._dataService.currentUniversity() || '';

        if (this.isSUadmin) {
            this.getUniversity();
        }
        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'feeTypes': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.editData = JSON.parse(sessionStorage.getItem('feeType'));
            this.objectForm.patchValue({
                universityId: this.editData['universityId']
            });
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(this.editData.typeName, Validators.required));
        } else {
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(null, Validators.required));
        }
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
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
            const data = this.objectForm.value;
            if (this.isEdit) {
                this._dataService.updateFeetype(this.editData.id, data.feeTypes[0], data.universityId).subscribe(res => {
                    this.toastr.success('Fees Type updated successfully', 'Info');
                    this.router.navigate(['/feeType']);
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.saveFeetype(this.objectForm.value.feeTypes, data.universityId).subscribe(res => {
                    this.toastr.success('Fees Type Saved successfully', 'Info');
                    this.router.navigate(['/feeType']);
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }
    }

}
