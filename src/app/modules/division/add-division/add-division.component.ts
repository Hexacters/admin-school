import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-division',
    templateUrl: './add-division.component.html',
    styleUrls: ['./add-division.component.scss']
})
export class AddDivisionComponent implements OnInit {
    objectForm: FormGroup;
    universityList: Array<any> = [];
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    semesterList = [];
    divisionList = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    semesterId: number = 0;
    public isEdit: boolean = false;
    public isSUadmin: boolean = false;
    public editData: object = {};
    public isNodivision: boolean = false;

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
        this.editData = JSON.parse(sessionStorage.getItem('division'));
        const reqData = JSON.parse(sessionStorage.getItem('by-semester'));

        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programmeName': new FormControl('', Validators.required),
            'semesterName': new FormControl('', Validators.required),
            'division': new FormArray([
            ])
        });
        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.schoolId = this.editData['schoolId'];
            this.departmentId = this.editData['departmentId'];
            this.programmeId = this.editData['programId'];
            this.semesterId = this.editData['semesterId'];
            this.objectForm.patchValue({
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programmeName: this.programmeId,
                semesterName: this.semesterId,
                universityId: this.editData['universityId']
            });
            (<FormArray>this.objectForm.get('division')).push(new FormControl(this.editData['divisionName']));

            this.getSchoolList(req);
            this.getdepartmentList(this.isEdit);
            this.getprogrammeList(this.isEdit);
            this.getSemesterList(this.isEdit);
        } else {
            if (reqData) {
                this.schoolId = reqData['schoolId'];
                this.departmentId = reqData['departmentId'];
                this.programmeId = reqData['programId'];
                this.semesterId = reqData['id'];
                this.objectForm.patchValue({
                    schoolName: this.schoolId,
                    departmentName: this.departmentId,
                    programmeName: this.programmeId,
                    semesterName: this.semesterId,
                    universityId: reqData['universityId']
                });
                this.getSchoolList(req);
                this.getdepartmentList(this.isEdit);
                this.getprogrammeList(this.isEdit);
                this.getSemesterList(this.isEdit);
            }
            (<FormArray>this.objectForm.get('division')).push(new FormControl());
        }
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

    getSemesterList(isEdit: boolean = false, data?): void {
        this._dataService.getsemesterList(data).subscribe(res => {
            this.semesterList = [...res];
        })
    }

    addDivision() {
        this.divisionList.push({});
        (<FormArray>this.objectForm.get('division')).push(new FormControl(null, Validators.required));
    }

    removeDivision(i) {
        this.divisionList.splice(i, 1);
        (<FormArray>this.objectForm.get('division')).removeAt(i);
    }

    selectUniversity(event) {
        this.getSchoolList({
            universityId: event || 0,
        });
        this.objectForm.patchValue({
            schoolName: ''
        })
    }

    selectSchool(event) {
        this.schoolId = event;
        this.getdepartmentList(false, {
            schoolId: this.schoolId,
        });
    }

    selectDepartment(event) {
        this.departmentId = event;
        this.getprogrammeList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        });
    }

    selectProgramme(event) {
        this.programmeId = event;
        this.getSemesterList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
        });
    }

    selectSemester(event) {
        if (this.semesterList.length) {
            this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, event);
        }
        this.semesterId = event;
    }

    onSubmit(isEdit: boolean = this.isEdit): void {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            let body = [];
            if (this.objectForm.value.division[0] === null) {
                alert('Please fill the required feilds')
            } else {
                this.objectForm.value.division.forEach(e => {
                    body.push({
                        "schoolId": this.schoolId,
                        "departmentId": this.departmentId,
                        'programId': this.programmeId,
                        "semesterId": this.semesterId,
                        "divisionName": e
                    });
                })
               
            }
            if (isEdit) {
                this._dataService.updateDivision(this.editData['id'], body[0]).subscribe(res => {
                    this.router.navigate(['/division']);
                    this.toastr.success('Division details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.saveDivision(body).subscribe(res => {
                    this.router.navigate(['/division']);
                    this.toastr.success('Division details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }

    }

}
