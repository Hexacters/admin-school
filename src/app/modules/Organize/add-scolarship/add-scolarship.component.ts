import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-scolarship',
    templateUrl: './add-scolarship.component.html',
    styleUrls: ['./add-scolarship.component.scss']
})
export class AddScolarshipComponent implements OnInit {
    scholarshipForm: FormGroup;
    editFlag = true;
    public selectedFeeType = {};
    public universityList: Array<any> = [{}];
    public typeList: Array<any> = [];
    public scholorsipList: Array<any> = [];
    public isEdit: boolean = false;
    public editData: object = {};
    public isSUadmin: boolean = false;

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
        this.scholarshipForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'typeId': new FormControl('', Validators.required),
            'scholorsip': new FormArray([])
        });
        // (<FormArray>this.objectForm.get('departments')).push(new FormControl());
        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.editData = JSON.parse(sessionStorage.getItem('scholarship'));
            this.scholarshipForm.patchValue({ ...this.editData });
            this.onAdd(this.editData);
        } else {
            this.onAdd();
        }
        this.getType(this.editFlag);
    }

    public getScholarsip(data) {
        return new FormGroup({
            'scholarshipType': new FormControl(data['scholarshipType'] || 'amount', Validators.required),
            'name': new FormControl(data['name'] || '', Validators.required),
            'value': new FormControl(data['value'] || '', Validators.required),
        })
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
    }

    public onAdd(data = {}) {
        this.scholorsipList.push(data);
        (<FormArray>this.scholarshipForm.get('scholorsip')).push(this.getScholarsip(data));
    }

    public getType(isEdit: boolean = false): void {
        const id = this._dataService.currentUniversity() || '';
        let req;
        if (id) {
            req = {
                universityId: id
            }
        }
        this._dataService.getFeetypeList(req).subscribe(res => {
            this.typeList = [...res];
        })
    }

    public selectType(value, index: number = 0): void {
        this.selectedFeeType[index] = value;
    }

    public addMore(): void {
        this.onAdd()
    }

    public removeMore(i): void {
        this.scholorsipList.splice(i, 1);
        (<FormArray>this.scholarshipForm.get('scholorsip')).removeAt(i);
    }

    public onSubmit(): void {
        this.scholarshipForm.markAllAsTouched();
        if (this.scholarshipForm.valid) {
            const data = this.scholarshipForm.value;
            let body = {};

            body = data.scholorsip.map(e => {
                e.typeId = data.typeId;
                e.universityId = data.universityId;
                return e;
            });
            if (!this.editFlag) {
                this._dataService.updateScholarship(this.editData['id'], body[0]).subscribe(res => {
                    this.router.navigate(['scholarship']);
                    sessionStorage.clear();
                    this.toastr.success('Scholarship details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
                return;
            }
            this._dataService.saveScholarship(body).subscribe(res => {
                this.router.navigate(['scholarship']);
                this.toastr.success('Scholarship details saved successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }


}
