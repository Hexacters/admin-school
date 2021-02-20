import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';
import * as moment from 'moment';
@Component({
    selector: 'app-add-sem',
    templateUrl: './add-sem.component.html',
    styleUrls: ['./add-sem.component.scss']
})
export class AddSemComponent implements OnInit {

    objectForm: FormGroup;
    universityList: Array<any> = [];
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    semesterList = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    public isEdit: boolean = false;
    public isSUadmin: boolean = false;
    public editData: object = {};

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
        this.editData = JSON.parse(sessionStorage.getItem('semester'));
        const reqData = JSON.parse(sessionStorage.getItem('by-program'));

        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programmeName': new FormControl('', Validators.required),
            'semester': new FormArray([]),
            'divisionAddition': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.schoolId = this.editData['schoolId'];
            this.departmentId = this.editData['departmentId'];
            this.programmeId = this.editData['programId'];

            this.objectForm.patchValue({
                universityId: this.editData['universityId'],
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programmeName: this.programmeId
            });
            (<FormArray>this.objectForm.get('semester')).push(new FormControl(this.editData['semesterName']));
            (<FormArray>this.objectForm.get('divisionAddition')).push(new FormControl(this.editData['divisionAddition']));

            this.getSchoolList(req);
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
                    programmeName: this.programmeId,
                    universityId: reqData['universityId']
                });

                this.getSchoolList(req);
                this.getdepartmentList(this.isEdit);
                this.getprogrammeList(this.isEdit);
            }

            (<FormArray>this.objectForm.get('semester')).push(new FormControl());
            (<FormArray>this.objectForm.get('divisionAddition')).push(new FormControl());
        }
        this.getUniversity();
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
    }

    getSchoolList(data?): void {
        this._dataService.getSchoolList(data).subscribe(res => {
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
        (<FormArray>this.objectForm.get('divisionAddition')).push(new FormControl(false, Validators.required));
    }

    removeSemester(i) {
        this.semesterList.splice(i, 1);
        (<FormArray>this.objectForm.get('semester')).removeAt(i);
        (<FormArray>this.objectForm.get('divisionAddition')).removeAt(i);
    }

    selectUniversity(event) {
        this.getSchoolList({
            universityId: event || 0,
        });
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
            let body = [];
            if (this.objectForm.value.semester[0] === null) {
                alert()
            } else {
                this.objectForm.value.semester.map((e, i) => {
                    body.push({
                        "schoolId": this.schoolId,
                        "departmentId": this.departmentId,
                        'programId': this.programmeId,
                        "semesterName": e,
                        "divisionAddition": !!this.objectForm.value.divisionAddition[i],
                    });
                });
            }

            if (isUpdate) {
                this._dataService.updateSemester(this.editData['id'], body[0]).subscribe(res => {
                    this.router.navigate(['/semester']);
                    this.toastr.success('Semester details Saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.savesemester(body).subscribe(res => {
                    this.addDivision(body, res);
                    this.router.navigate(['/semester']);
                    this.toastr.success('Semester details updated successfully', 'Info');

                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }
    }

    public addDivision(data: any[], res: any[]) {
        
        const body: any[] = [];
        res.forEach((e, i) => {
            let req = {
                "schoolId": 0,
                "departmentId": 0,
                "programId": 0,
                "semesterId": 0,
                "divisionName": ''
            }
            const name = +moment().format('x') + i + 1;
            console.log(name)
            if (e.isDivisionAddition) {
                req.departmentId = data[i].departmentId;
                req.programId = data[i].programId;
                req.schoolId = data[i].schoolId;
                req.semesterId = e.id;
                req.divisionName = name + '';
                body.push(req);
            }
        });
        console.log(body)
        this._dataService.saveDivision(body).subscribe();
    }

}
