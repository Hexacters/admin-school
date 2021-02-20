import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-department',
    templateUrl: './add-department.component.html',
    styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit, OnDestroy {

    objectForm: FormGroup;
    schoolList: Array<any> = [{}];
    universityList: Array<any> = [{}];
    departmentList: Array<any> = [{}];
    schoolId: number = 0;
    editFlag = true;
    id = 0;
    universityId: number;
    schoolName = '';
    departmentName = '';
    dprtObj;
    isSUadmin: boolean = false;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.isSUadmin = this._dataService.isSuperAdmin();
        const id = this._dataService.currentUniversity() || '';
        let req;
        if (this.isSUadmin) {
            this.getUniversity();
        } else {
            req = {
                universityId: id
            }
            this.getSchoolList(req);
        }

        this.dprtObj = JSON.parse(sessionStorage.getItem('dprtmnt'));
        const bySchool = JSON.parse(sessionStorage.getItem('by-school'));
        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'schoolName': new FormControl('', Validators.required),
            'departments': new FormArray([])
        });
        // (<FormArray>this.objectForm.get('departments')).push(new FormControl());
        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.id = this.dprtObj.id;
            this.objectForm.patchValue({
                universityId: this.dprtObj.universityId,
                schoolName: this.dprtObj.schoolId,
            });
            this.selectUniversity(this.dprtObj.universityId);
            (<FormArray>this.objectForm.get('departments')).push(new FormControl(this.dprtObj.departmentName, Validators.required));
        } else {
            if (bySchool) {
                this.schoolId = bySchool.id;
                this.objectForm.patchValue({
                    schoolName: bySchool.id,
                    universityId: bySchool.universityId
                });
                this.getSchoolList(req);
            }
            (<FormArray>this.objectForm.get('departments')).push(new FormControl(null, Validators.required));
        }
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
    }

    getSchoolList(data?) {
        this._dataService.getSchoolList(data).subscribe(res => {
            this.schoolList = [...res];
            console.log(this.schoolList)
        });
    }

    addDepartment() {
        this.departmentList.push({});
        (<FormArray>this.objectForm.get('departments')).push(new FormControl(null, Validators.required));
    }

    removeDepartment(i) {
        this.departmentList.splice(i, 1);
        (<FormArray>this.objectForm.get('departments')).removeAt(i);
    }

    selectSchool(event) {
        this.schoolId = event;
    }

    selectUniversity(event) {
        this.universityId = event;
        this.getSchoolList({
            universityId: event || 0,
        });
    }

    onSubmit() {
        this.objectForm.markAllAsTouched();
        let body = {};
        if (this.objectForm.valid) {
            body = {
                "departments": [...this.objectForm.value.departments],
                "schoolId": this.schoolId

            }

            if (!this.editFlag) {
                this._dataService.updateDepartment(this.id, body).subscribe(res => {
                    this.router.navigate(['department']);
                    sessionStorage.clear();
                    this.toastr.success('Department details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.saveDepartment(body).subscribe(res => {
                    this.router.navigate(['department']);
                    this.toastr.success('Department details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

}
