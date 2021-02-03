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
    departmentList: Array<any> = [{}];
    schoolId: number = 0;
    editFlag = true;
    id = 0;
    schoolName = '';
    departmentName = '';
    dprtObj;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.dprtObj = JSON.parse(sessionStorage.getItem('dprtmnt'));
        const bySchool = JSON.parse(sessionStorage.getItem('by-school'));
        this.getDepartment();
        this.objectForm = new FormGroup({
            'schoolName': new FormControl('', Validators.required),
            'departments': new FormArray([])
        });
        // (<FormArray>this.objectForm.get('departments')).push(new FormControl());
        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.id = this.dprtObj.id;
            (<FormArray>this.objectForm.get('departments')).push(new FormControl(this.dprtObj.departmentName, Validators.required));
        } else {
            if (bySchool) {
                this.schoolId = bySchool.id;
                this.objectForm.get('schoolName').setValue(bySchool.id);
            }
            (<FormArray>this.objectForm.get('departments')).push(new FormControl(null, Validators.required));
        }
    }

    getDepartment() {
        this._dataService.getSchoolList().subscribe(res => {
            this.schoolList = [...res];
            console.log(this.schoolList)
            if (this.router.url.includes('edit')) {

                this.schoolList.forEach(element => {
                    if (element.schoolName === this.dprtObj.schoolName) {
                        this.objectForm.get('schoolName').setValue(element.id);
                        this.schoolId = element.id;
                    }
                });
            }

        })
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
