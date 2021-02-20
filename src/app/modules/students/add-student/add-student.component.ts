import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
    studentForm: FormGroup;
    editFlag = false;
    public selectedFeeType = {};
    public universityList: Array<any> = [];
    public studentsList: Array<any> = [];
    public schoolList: Array<any> = [];
    public departmentList: Array<any> = [];
    public programmeList: Array<any> = [];
    public semesterList = [];
    public divisionList = [];
    public editData: object = {};
    public schoolId: number = 0;
    public departmentId: number = 0;
    public programmeId: number = 0;
    public semesterId: number = 0;
    public divisionId: number = 0;
    public isSUadmin: boolean = false;
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
        this.studentForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'schoolId': new FormControl('', Validators.required),
            'departmentId': new FormControl('', Validators.required),
            'programId': new FormControl('', Validators.required),
            'semesterId': new FormControl('', Validators.required),
            'divisionId': new FormControl('', Validators.required),
            'students': new FormArray([])
        });
        if (this.router.url.includes('edit')) {
            this.editFlag = true;
            this.editData = JSON.parse(sessionStorage.getItem('students'));
            this.studentForm.patchValue({ ...this.editData });
            this.onAdd(this.editData);
            this.getSchoolList(req);
            this.getdepartmentList(this.editFlag);
            this.getprogrammeList(this.editFlag);
            this.getSemesterList(this.editFlag);
            this.getDivisionList(this.editFlag);
        } else {
            this.onAdd();
        }
    }

    public getScholarsip(data) {
        return new FormGroup({
            'firstName': new FormControl(data['firstName'] || '', Validators.required),
            'lastName': new FormControl(' '),
            'rollNo': new FormControl(data['rollNo'] || '', Validators.required),
            'emailId': new FormControl(data['emailId'] || '', Validators.email),
            'phoneNo': new FormControl(data['phoneNo'] || '', Validators.required),
            'parentPhoneNo': new FormControl(data['parentPhoneNo'] || ''),
            'parentEmailId': new FormControl(data['parentEmailId'] || '',Validators.email),
            'password': new FormControl(data['password'] || ''),
        })
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
            this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, this.editData['semesterId']);
        })
    }

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
            if (this.isNodivision && !this.editData['semesterId']) {
                const id =  res[0].id
                this.studentForm.patchValue({
                    divisionId: id
                });
                this.selectDivision(id);
            }
        })
    }

    selectUniversity(event) {
        this.getSchoolList({
            universityId: event || 0,
        });
    }

    selectSchool(event) {
        this.schoolId = event;
        this.getdepartmentList(this.editFlag, {
            schoolId: this.schoolId,
        });
    }

    selectDepartment(event) {
        this.departmentId = event;
        this.getprogrammeList(this.editFlag, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        });
    }

    selectProgramme(event) {
        this.programmeId = event;
        this.getSemesterList(this.editFlag, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
        });
    }

    selectSemester(event) {
        this.semesterId = event;
        this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, event);
        this.getDivisionList(this.editFlag, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        });
    }

    selectDivision(event) {
        this.divisionId = event;
    }

    public onAdd(data = {}) {
        this.studentsList.push(data);
        (<FormArray>this.studentForm.get('students')).push(this.getScholarsip(data));
    }


    public selectType(value, index: number = 0): void {
        this.selectedFeeType[index] = value;
    }

    public addMore(): void {
        this.onAdd()
    }

    public removeMore(i): void {
        this.studentsList.splice(i, 1);
        (<FormArray>this.studentForm.get('students')).removeAt(i);
    }

    public onSubmit(): void {
        this.studentForm.markAllAsTouched();
        if (this.studentForm.valid) {
        const data = { ...this.studentForm.value };
        let body = {};

        body = data.students.map(e => {
            delete data.students;
            return {
                ...data,
                ...e
            };
        });
        if (this.editFlag) {
            const reqData = body[0];
            delete reqData.password
            this._dataService.updateStudent(this.editData['id'], reqData).subscribe(res => {
                this.router.navigate(['students']);
                sessionStorage.clear();
                this.toastr.success('student details updated successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
            return;
        } 
        this._dataService.saveStudent(body).subscribe(res => {
            this.router.navigate(['students']);
            this.toastr.success('student details saved successfully', 'Info');
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });
    }
    }

    update() {
        const data = this.studentForm.value;
        let body = {};

        body = data.students.map(e => {
            delete data.students;
            return {
                ...data,
                ...e
            };
        })

        
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

}
