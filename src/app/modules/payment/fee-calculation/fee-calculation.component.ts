import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-fee-calculation',
    templateUrl: './fee-calculation.component.html',
    styleUrls: ['./fee-calculation.component.scss']
})
export class FeeCalculationComponent implements OnInit {
    studentForm: FormGroup;
    public selectedFeeType = {};
    public studentsList: Array<any>;
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

    displayedColumns: string[] = ['index', 'studentName', 'netAmount', 'update', 'view'];
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
        this.studentForm = new FormGroup({
            'schoolId': new FormControl('0', Validators.required),
            'departmentId': new FormControl('0', Validators.required),
            'programId': new FormControl('0', Validators.required),
            'semesterId': new FormControl('0', Validators.required),
            'divisionId': new FormControl('0', Validators.required),
            'students': new FormArray([])
        });

        this.getSchoolList();
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
        });
    }

    getStudentList(isEdit: boolean = false, data?): void {
        this._dataService.getFeeCalculation(data).subscribe(res => {
            this.studentsList = [...res.priceCalculationList];
            this.dataSource = new MatTableDataSource(this.studentsList.filter(e => e.id));
            this.dataSource.paginator = this.paginator;
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
        this.getStudentList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
            divisionId: this.divisionId
        });
    }

    public selectType(value, index: number = 0): void {
        this.selectedFeeType[index] = value;
    }

    updateFee(data) {
        data.divisionId = this.divisionId;
        sessionStorage.setItem('feeCalculation', JSON.stringify(data));
        this.router.navigate(['fee-calculation/update']);
    }

    viewFee(data) {
        data.divisionId = this.divisionId;
        sessionStorage.setItem('feeCalculation', JSON.stringify(data));
        this.router.navigate(['fee-calculation/view']);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
