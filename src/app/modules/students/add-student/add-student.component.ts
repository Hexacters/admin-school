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

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.studentForm = new FormGroup({
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
            this.getdepartmentList(this.editFlag);
            this.getprogrammeList(this.editFlag);
            this.getSemesterList(this.editFlag);
            this.getDivisionList(this.editFlag);
        } else {
            this.onAdd();
        }
        this.getSchoolList(this.editFlag);
    }

    public getScholarsip(data) {
        return new FormGroup({
            'firstName': new FormControl(data['firstName'] || '', Validators.required),
            'lastName': new FormControl(data['lastName'] || '', Validators.required),
            'emailId': new FormControl(data['emailId'] || '', Validators.required),
            'phoneNo': new FormControl(data['phoneNo'] || '', Validators.required),
            'parentPhoneNo': new FormControl(data['parentPhoneNo'] || '', Validators.required),
            'parentEmailId': new FormControl(data['parentEmailId'] || '', Validators.required),
        })
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

    getSemesterList(isEdit: boolean = false, data?): void {
        this._dataService.getsemesterList(data).subscribe(res => {
            this.semesterList = [...res];
        })
    }

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
        })
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

    public onSubmit(): void {
        this.studentForm.markAllAsTouched();
        if (this.studentForm.valid) {
        const data = this.studentForm.value;
        let body = {};

        body = data.students.map(e => {
            delete data.students;
            return {
                ...data,
                ...e
            };
        });
        if (this.editFlag) {
            this._dataService.updateStudent(this.editData['id'], body[0]).subscribe(res => {
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
