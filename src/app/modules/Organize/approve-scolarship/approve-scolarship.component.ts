import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-approve-scolarship',
    templateUrl: './approve-scolarship.component.html',
    styleUrls: ['./approve-scolarship.component.scss']
})
export class ApproveScolarshipComponent implements OnInit {
    studentForm: FormGroup;
    editFlag = false;
    public selectedFeeType = {};
    public universityList: Array<any> = [];
    public studentsList: Array<any> = [];
    public assignScholorList: Array<any> = [];
    public scholarshipList: Array<any> = [];
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
    public selectedIds: object = {};
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
            'scholarsips': new FormArray([])
        });
        if (this.router.url.includes('edit')) {
            this.editFlag = true;
            this.editData = JSON.parse(sessionStorage.getItem('assignScholarsips'));
            this.studentForm.patchValue({ ...this.editData });
            this.onAdd(this.editData);
            this.getSchoolList(req);
            this.getdepartmentList(this.editFlag);
            this.getprogrammeList(this.editFlag);
            this.getSemesterList(this.editFlag);
            this.getDivisionList(this.editFlag);
            this.getStudentList();
        } else {
            this.onAdd();
        }
        this.getScholarshipList();
    }

    public getScholarsip(data, index?) {
        this.selectedIds[index] = [data['scholarshipId'] || 1];
        return new FormGroup({
            'studentId': new FormControl(data['studentId'] || '', Validators.required),
            'scholarshipIds': new FormControl([data['scholarshipId'] || 1], Validators.required),
        })
    }

    getSelectedName(i) {
        let data = {};
        if (this.selectedIds) {
            data = this.selectedIds[i];
        }

        if (data && Object.keys(data).length) {
            let res = this.scholarshipList.find(e => {
                return e.id === data[0]
            });
            let name = res && res.name;

            if (Object.keys(data).length > 1) {
                name += ` (+${Object.keys(data).length - 1} Others)`;
            }
            return name;
        }
        return '';

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

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
            if (this.isNodivision) {
                const id =  res[0].id
                this.studentForm.patchValue({
                    divisionId: id
                });
                this.selectDivision(id);
            } else {
                this.selectDivision(0);
            }
        })
    }

    getStudentList(isEdit: boolean = false, data?): void {
        this._dataService.getStudent(data).subscribe(res => {
            this.studentsList = [...res];
        })
    }

    getScholarshipList(): void {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getScholarship(req).subscribe(res => {
            this.scholarshipList = [...res];
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
        this.getStudentList(this.editFlag, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
            divisionId: this.divisionId
        });
    }

    selectStudent(event) {

    }

    selectScholarship(event, i) {
        if (event.includes(1)) {
            (<FormArray>this.studentForm.get('scholarsips')).at(i).get('scholarshipIds').setValue([1]);
            this.selectedIds[i] = [1];
        } else {
            this.selectedIds[i] = event;
        }

    }

    public onAdd(data = {}, i = 0) {
        this.assignScholorList.push(data);
        (<FormArray>this.studentForm.get('scholarsips')).push(this.getScholarsip(data, i));
    }

    public onRemove(i = 0) {
        this.assignScholorList.splice(i, 1);
        (<FormArray>this.studentForm.get('scholarsips')).removeAt(i);
    }

    public selectType(value, index: number = 0): void {
        this.selectedFeeType[index] = value;
    }

    public updatePriceCalculation(params) {
        this._dataService.updateScholarPriceCalculation(params).subscribe(res => {
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });
    }

    public onSubmit(): void {
        this.studentForm.markAllAsTouched();
        if (this.studentForm.valid) {
            const data = this.studentForm.value;
            let body = [];

            data.scholarsips.forEach(e => {
                e.scholarshipIds.forEach(id => {
                    delete data.scholarsips;
                    body.push({
                        studentId: e.studentId,
                        scholarshipId: id,
                        ...data,
                    });

                });
            });
            if (this.editFlag) {
                this._dataService.updateAssignScholarship(this.editData['id'], body[0]).subscribe(res => {
                    this.router.navigate(['assign']);
                    sessionStorage.clear();
                    this.toastr.success('Scholarship details updated successfully', 'Info');
                    this.updatePriceCalculation({
                        studentId: body[0].studentId,
                        divisionId: body[0].divisionId
                    });
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
                return;
            }
            this._dataService.saveAssignScholarship(body).subscribe(res => {
                this.router.navigate(['assign']);
                this.toastr.success('Scholarship Assigned successfully', 'Info');
                this.updatePriceCalculation({
                    studentId: body[0].studentId,
                    divisionId: body[0].divisionId
                });
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }
}
