import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

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
        private router: Router
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'feeTypes': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.editData = JSON.parse(sessionStorage.getItem('feeType'));
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(this.editData.typeName));
        } else {
            (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl());
        }
    }

    addFeeType() {
        this.feeTypeList.push({});
        (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(null, Validators.required));
    }

    onSubmit() {
        this._dataService.saveFeetype(this.objectForm.value.feeTypes).subscribe(res => {
            this.router.navigate(['/feeType/view']);
        })
    }

    onUpdate() {
        const typeName = this.objectForm.value.feeTypes[0];
        this._dataService.updateFeetype(this.editData.id, typeName).subscribe(res => {
            this.router.navigate(['/feeType/view']);
        })
    }

}
