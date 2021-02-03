import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-programme',
    templateUrl: './add-programme.component.html',
    styleUrls: ['./add-programme.component.scss']
})
export class AddProgrammeComponent implements OnInit {


    objectForm: FormGroup;
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    isEdit: boolean = false;
    public editData: object = {};

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.getSchoolList();
        this.editData = JSON.parse(sessionStorage.getItem('programm'));
        const byDepartment = JSON.parse(sessionStorage.getItem('by-department'));

        this.objectForm = new FormGroup({
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programme': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.departmentId = this.editData['departmentId'];
            this.schoolId = this.editData['schoolId'];
            this.objectForm.patchValue({
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programme: []
            });
            (<FormArray>this.objectForm.get('programme')).push(new FormControl(this.editData['programName']));
            this.getDepartmentList();
        } else {
            if (byDepartment) {
                this.objectForm.patchValue({
                    schoolName: byDepartment.schoolId,
                    departmentName: byDepartment.id,
                });
                this.schoolId = byDepartment.schoolId;
                this.departmentId = byDepartment.id;
                this.getDepartmentList();
            }
            (<FormArray>this.objectForm.get('programme')).push(new FormControl(null));
        }


        this.objectForm.patchValue({})
    }

    public getSchoolList(): void {
        this._dataService.getSchoolList().subscribe(res => {
            this.schoolList = [...res];
        });
    }

    public getDepartmentList(data?) {
        this._dataService.getDepartmentList(data).subscribe(res => {
            this.departmentList = [...res];
        });
    }

    addprogramme() {
        this.programmeList.push({});
        (<FormArray>this.objectForm.get('programme')).push(new FormControl(null, Validators.required));
    }

    removeProgramme(i) {
        this.programmeList.splice(i, 1);
        (<FormArray>this.objectForm.get('programme')).removeAt(i);
    }

    selectSchool(event) {
        this.schoolId = event;
        this.getDepartmentList({
            schoolId: this.schoolId,
        });
    }

    selectDepartment(event) {
        this.departmentId = event;
    }

    onSubmit(isUpdate: boolean = this.isEdit): void {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            let body = {};
            if (this.objectForm.value.programme[0] === null) {
                alert()
            } else {
                body = {
                    "programName": [...this.objectForm.value.programme],
                    "schoolId": this.schoolId,
                    "departmentId": this.departmentId
                }
            }
            if (isUpdate) {
                this._dataService.updateProgramme(this.editData['id'], body).subscribe(res => {
                    this.router.navigate(['/programm']);
                    this.toastr.success('Programm details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });

                return;
            }
            this._dataService.saveProgramme(body).subscribe(res => {
                this.router.navigate(['/programm']);
                this.toastr.success('Programm details updated successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

}
