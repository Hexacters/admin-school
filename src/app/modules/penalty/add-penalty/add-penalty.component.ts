import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalcommunicationService } from 'src/app/core/localcommunication.service';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-penalty',
    templateUrl: './add-penalty.component.html',
    styleUrls: ['./add-penalty.component.scss']
})
export class AddPenaltyComponent implements OnInit {

    penaltyForm: FormGroup;
    penaltyList: Array<any> = [];
    editFlag: boolean = false;
    editData: object = {};
    frequency = [{ 'name': 'Day' }, { 'name': 'Weekly' }, { 'name': 'Monthly' }, { 'name': 'Quartly' }, { 'name': 'Half Yearly' }, { 'name': 'Yearly' }]

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) {

    }

    ngOnInit() {
        this.penaltyForm = new FormGroup({
            'penalty': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.editFlag = true;
            this.editData = JSON.parse(sessionStorage.getItem('penalty'));
            this.onAdd(this.editData);
        } else {
            this.onAdd();
        }
    }

    public getPenalty(data) {
        return new FormGroup({
            'penaltyName': new FormControl(data['penaltyName'] || '', Validators.required),
            'penaltyAmount': new FormControl(data['penaltyAmount'] || '', Validators.required),
            'frequency': new FormControl(data['frequency'] || '', Validators.required),
        })
    }

    public onAdd(data = {}) {
        this.penaltyList.push(data);
        (<FormArray>this.penaltyForm.get('penalty')).push(this.getPenalty(data));
    }

    onSubmit() {
        this.penaltyForm.markAllAsTouched();
        if (this.penaltyForm.valid) {
            const penalityForm = this.penaltyForm.value;
            if (!this.editFlag) {
                this._dataService.savePenalty(penalityForm.penalty).subscribe(res => {
                    this.router.navigate(['/penalty']);
                    this.toastr.success('Penalty details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
                return;
            }
            this._dataService.updatePenalty(this.editData['id'], penalityForm.penalty[0]).subscribe(res => {
                this.router.navigate(['/penalty']);
                this.toastr.success('Penalty details updated successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

    onUpdate() {
        const penalityForm = this.penaltyForm.value;

    }
}
