import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-fee',
    templateUrl: './add-fee.component.html',
    styleUrls: ['./add-fee.component.scss']
})
export class AddFeeComponent implements OnInit {
    objectForm: FormGroup;
    universityList: Array<any> = [];
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    semesterList = [];
    divisionList = [];
    typeList = [];
    feeList = [{}];
    feeTypeList = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    semesterId: number = 0;
    divisionId: number = 0;
    typeId: string = '';
    bodyArray = [];
    frequency = [{ 'name': 'Monthly' }, { 'name': 'Quartly' }, { 'name': 'Half Yearly' }, { 'name': 'Yearly' }]
    public isEdit: boolean = false;
    public isSUadmin: boolean = false;
    public isNodivision: boolean = false;
    public editData: object = {};
    public selectedFeeType = {};

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
        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'frequencyStop': new FormControl('', Validators.required),
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programmeName': new FormControl('', Validators.required),
            'semesterName': new FormControl('', Validators.required),
            'divisionName': new FormControl('', Validators.required),
            'frequencyName': new FormControl(this.frequency[0].name, Validators.required),
            'fee': new FormArray([]),
            'feeType': new FormArray([])
        });
        this.typeId = this.frequency[0].name;
        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.editData = JSON.parse(sessionStorage.getItem('fees'));
            this.schoolId = this.editData['schoolId'];
            this.departmentId = this.editData['departmentId'];
            this.programmeId = this.editData['programId'];
            this.semesterId = this.editData['semesterId'];
            this.divisionId = this.editData['divisionId'];
            this.typeId = this.editData['feeType'];
            this.objectForm.patchValue({
                universityId: this.editData['universityId'],
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programmeName: this.programmeId,
                semesterName: this.semesterId,
                divisionName: this.divisionId,
                frequencyName: this.editData['feeType'],
                frequencyStop: this.editData['frequencyStop']
            });
            (<FormArray>this.objectForm.get('fee')).push(new FormControl(this.editData['fee']));
            (<FormArray>this.objectForm.get('feeType')).push(new FormControl(this.editData['typeId']));
            this.getSchoolList(req);
            this.getdepartmentList(this.isEdit);
            this.getprogrammeList(this.isEdit);
            this.getSemesterList(this.isEdit);
            this.getDivisionList(this.isEdit);
        } else {
            (<FormArray>this.objectForm.get('fee')).push(new FormControl());
            (<FormArray>this.objectForm.get('feeType')).push(new FormControl());
        }
        this.getType(this.isEdit);
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
        });
    }

    getprogrammeList(isEdit: boolean = false, data?): void {
        this._dataService.getProgrammeList(data).subscribe(res => {
            this.programmeList = [...res];
        });
    }

    getSemesterList(isEdit: boolean = false, data?): void {
        this._dataService.getsemesterList(data).subscribe(res => {
            this.semesterList = [...res];
            this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, this.editData['semesterId']);
        });
    }

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
            if (this.isNodivision && !this.editData['semesterId']) {
                const id =  res[0].id
                this.objectForm.patchValue({
                    divisionName: id
                });
                this.selectDivision(id);
            }
        });
    }

    getType(isEdit: boolean = false): void {
        const id = this._dataService.currentUniversity() || '';
        let req;
        if (id) {
            req = {
                universityId: id
            }
        }
        this._dataService.getFeetypeList(req).subscribe(res => {
            this.typeList = [...res];
        });
    }

    addFee() {
        this.feeList.push({});
        (<FormArray>this.objectForm.get('feeType')).push(new FormControl(null, Validators.required));
        this.feeTypeList.push({});
        (<FormArray>this.objectForm.get('fee')).push(new FormControl(null, Validators.required));
    }

    removeFee(i) {
        this.feeList.splice(i, 1);
        (<FormArray>this.objectForm.get('feeType')).removeAt(i);
        this.feeTypeList.splice(i, 1);
        (<FormArray>this.objectForm.get('fee')).removeAt(i);
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
        this.semesterId = event;
        this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, event);
        this.getDivisionList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        });
    }

    selectDivision(event) {
        this.divisionId = event;
    }

    public getFeeTypeList(list, index) {
        const data = { ...this.selectedFeeType };
        data[index] = '';
        const selectedValues = Object.values(data);
        return list.filter((e, i) => {
            return !selectedValues.includes(e.id + '');
        })
    }

    selectType(value, index: number): void {
        this.selectedFeeType[index] = value;
    }

    selectFrequency(event) {
        this.typeId = event;
    }

    selectUniversity(event) {
        this.getSchoolList({
            universityId: event || 0,
        });
        this.objectForm.patchValue({
            schoolName: ''
        })
    }

    updateFeeCalculation(data) {
        this._dataService.updatePriceCalculation(data).subscribe(res => {
            // Success
        });
    }

    onSubmit(isEdit: boolean = false): void {
        this.bodyArray = [];
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            for (let i = 0; i < this.objectForm.value.feeType.length; i++) {
                const element = this.objectForm.value.feeType[i];
                this.bodyArray.push({
                    "schoolId": this.schoolId + '',
                    "departmentId": this.departmentId + '',
                    "programId": this.programmeId + '',
                    "semesterId": this.semesterId + '',
                    "divisionId": this.divisionId + '',
                    "typeId": element,
                    "feeType": this.typeId,
                    "frequencyStop": this.objectForm.value.frequencyStop,
                    "fee": this.objectForm.value.fee[i]
                })
            }
            if (this.isEdit) {
                this._dataService.updateFee(this.editData['id'], this.bodyArray[0]).subscribe(res => {
                    this.updateFeeCalculation({
                        schoolId: this.schoolId,
                        departmentId: this.departmentId,
                        programId: this.programmeId,
                        semesterId: this.semesterId,
                        divisionId: this.divisionId
                    });
                    this.router.navigate(['/fee']);
                    this.objectForm.reset();
                    this.bodyArray = [];
                    this.feeList = [{}];
                    this.feeTypeList = [{}];
                    this.toastr.success('Fee details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.saveFee(this.bodyArray).subscribe(res => {
                    this.updateFeeCalculation({
                        schoolId: this.schoolId,
                        departmentId: this.departmentId,
                        programId: this.programmeId,
                        semesterId: this.semesterId,
                        divisionId: this.divisionId
                    });
                    this.router.navigate(['/fee']);
                    this.objectForm.reset();
                    this.bodyArray = [];
                    this.feeList = [{}];
                    this.feeTypeList = [{}];
                    this.toastr.success('Fee details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        }

    }

}
