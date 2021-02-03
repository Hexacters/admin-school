import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-sem',
    templateUrl: './add-sem.component.html',
    styleUrls: ['./add-sem.component.scss']
})
export class AddSemComponent implements OnInit {

    objectForm: FormGroup;
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    semesterList = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    public isEdit: boolean = false;
    public editData: object = {};

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.editData = JSON.parse(sessionStorage.getItem('semester'));
        const reqData = JSON.parse(sessionStorage.getItem('by-program'));

        this.objectForm = new FormGroup({
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programmeName': new FormControl('', Validators.required),
            'semester': new FormArray([
            ])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.schoolId = this.editData['schoolId'];
            this.departmentId = this.editData['departmentId'];
            this.programmeId = this.editData['programId'];

            this.objectForm.patchValue({
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programmeName: this.programmeId
            });
            (<FormArray>this.objectForm.get('semester')).push(new FormControl(this.editData['semesterName']));

            this.getdepartmentList(this.isEdit);
            this.getprogrammeList(this.isEdit);
        } else {
            if (reqData) {
                this.schoolId = reqData['schoolId'];
                this.departmentId = reqData['departmentId'];
                this.programmeId = reqData['id'];
                this.objectForm.patchValue({
                    schoolName: this.schoolId,
                    departmentName: this.departmentId,
                    programmeName: this.programmeId
                });
                this.getdepartmentList(this.isEdit);
                this.getprogrammeList(this.isEdit);
            }
            
            (<FormArray>this.objectForm.get('semester')).push(new FormControl());
        }
        this.getSchoolList(this.isEdit);
    }

    getSchoolList(isEdit: boolean = false): void {
        this._dataService.getSchoolList().subscribe(res => {
            this.schoolList = [...res];
        });
    }

    getdepartmentList(isEdit: boolean = false, data?): void {
        this._dataService.getDepartmentList(data).subscribe(res => {
            this.departmentList = [...res];
        })
    }

    getprogrammeList(isEdit: boolean = false, data?): void {
        this._dataService.getProgrammeList(data).subscribe(res => {
            this.programmeList = [...res];
        })
    }

    addSemester() {
        this.semesterList.push({});
        (<FormArray>this.objectForm.get('semester')).push(new FormControl(null, Validators.required));
    }

    removeSemester(i) {
        this.semesterList.splice(i, 1);
        (<FormArray>this.objectForm.get('semester')).removeAt(i);
    }


    selectSchool(event) {
        this.schoolId = event;
        this.getdepartmentList(this.isEdit, {
            schoolId: this.schoolId,
        });
    }

    selectDepartment(event) {
        this.departmentId = event;
        this.getprogrammeList(this.isEdit, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        });
    }

    selectProgramme(event) {
        this.programmeId = event;
    }

    onSubmit(isUpdate: boolean = this.isEdit): void {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            let body = {};
            if (this.objectForm.value.semester[0] === null) {
                alert()
            } else {
                body = {
                    "schoolId": this.schoolId,
                    "departmentId": this.departmentId,
                    'programId': this.programmeId,
                    "semesterName": [...this.objectForm.value.semester]
                }
            }

            if (isUpdate) {
                this._dataService.updateSemester(this.editData['id'], body).subscribe(res => {
                    this.router.navigate(['/semester']);
                    this.toastr.success('Semester details Saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.savesemester(body).subscribe(res => {
                    this.router.navigate(['/semester']);
                    this.toastr.success('Semester details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }

    }

}
