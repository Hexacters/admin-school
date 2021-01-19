import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-active-fee',
    templateUrl: './add-active-fee.component.html',
    styleUrls: ['./add-active-fee.component.scss']
})
export class AddActiveFeeComponent implements OnInit {
    objectForm: FormGroup;
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    studentsList: Array<any>;
    semesterList = [];
    divisionList = [];

    penalty = [];
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    semesterId: number = 0;
    divisionId: number = 0;
    minDate: Date = new Date();

    public isEdit: boolean = false;
    public editData: object = {};
    public selectedFeeType = {};
    displayedColumns: string[] = ['index', 'studentName', 'netAmount'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  
    paginator: MatPaginator;

    @ViewChild('matPaginator', {static: false}) set setPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'schoolId': new FormControl('', Validators.required),
            'departmentId': new FormControl('', Validators.required),
            'programId': new FormControl('', Validators.required),
            'semesterId': new FormControl('', Validators.required),
            'divisionId': new FormControl('', Validators.required),
            'penaltyId': new FormControl('', Validators.required),
            'activationDate': new FormControl(new Date(), Validators.required),
            'activateFee': new FormControl(true, Validators.required),
        });
        this.getSchoolList(this.isEdit);
        this.getPenality();
    }

    getSchoolList(isEdit: boolean = false): void {
        this._dataService.getSchoolList().subscribe(res => {
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
        });
    }

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
        });
    }

    getPenality(): void {
        this._dataService.getPenalty().subscribe(res => {
            this.penalty = [...res];
        });
    }

    getStudentList(data?): void {
        this._dataService.getFeeCalculation(data).subscribe(res => {
            this.studentsList = [...res.priceCalculationList];
            this.dataSource = new MatTableDataSource(this.studentsList.filter(e => e.id));
            this.dataSource.paginator = this.paginator;
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });
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
        this.getDivisionList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        });
    }

    selectDivision(event) {
        this.divisionId = event;
        this.getStudentList({
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
            divisionId: this.divisionId
        })
    }

    onSubmit(): void {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            const data = this.objectForm.value;
            this._dataService.addActiveFee([data]).subscribe(res => {
                this.router.navigate(['active-fee']);
                this.toastr.success('Updated Sucessfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

}
