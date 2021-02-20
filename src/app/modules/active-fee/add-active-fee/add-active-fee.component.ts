import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { ActiveFeeService } from '../active-fee.service';
import { ActiveFeeModalComponent } from '../modal/active-fee-modal/active-fee-modal.component';

@Component({
    selector: 'app-add-active-fee',
    templateUrl: './add-active-fee.component.html',
    styleUrls: ['./add-active-fee.component.scss']
})
export class AddActiveFeeComponent implements OnInit {
    objectForm: FormGroup;
    universityList: Array<any> = [];
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
    public isSUadmin: boolean = false;
    public isNodivision: boolean = false;
    public editData: object = {};
    public selectedFeeType = {};
    public prevObject: any = {};
    displayedColumns: string[] = ['index', 'schoolName', 'type', 'feeType', 'frequencyStop', 'fee', 'action'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  
    paginator: MatPaginator;

    @ViewChild('matPaginator', {static: false}) set setPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog,
        public activeFeeService: ActiveFeeService,
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
            'schoolId': new FormControl('', Validators.required),
            'universityId': new FormControl(id, Validators.required),
            'departmentId': new FormControl('', Validators.required),
            'programId': new FormControl('', Validators.required),
            'semesterId': new FormControl('', Validators.required),
            'divisionId': new FormControl('', Validators.required),
        });
        this.getPenality();
        const tempData = JSON.parse(sessionStorage.getItem('tempData'));
        if (tempData) {
            if (tempData.universityId) {
                this.selectUniversity(tempData.universityId);
            }
            if (tempData.schoolId) {
                this.selectSchool(tempData.schoolId);
            }
            if (tempData.departmentId) {
                this.selectDepartment(tempData.departmentId);
            }
            if (tempData.programId) {
                this.selectProgramme(tempData.programId);
            }
            if (tempData.semesterId) {
                this.selectSemester(tempData.semesterId);
            }
            if (tempData.divisionId) {
                this.selectDivision(tempData.divisionId);
            }
            this.objectForm.patchValue({
                ...tempData
            });
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
            const tempData = JSON.parse(sessionStorage.getItem('tempData'));
            if (tempData && tempData.semesterId) {
                this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, tempData.semesterId);
            }
        });
    }

    getDivisionList(isEdit: boolean = false, data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
            if (this.isNodivision) {
                const id =  res[0].id
                this.objectForm.patchValue({
                    divisionId: id
                });
                this.selectDivision(id);
            } else {
                const tempData = JSON.parse(sessionStorage.getItem('tempData'));
                if (tempData && isEdit) {
                    this.selectDivision(tempData.divisionId);
                } else {
                    this.selectDivision(0);
                }
            }
        });
    }

    getPenality(): void {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getPenalty(req).subscribe(res => {
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

    getFeeList(data?): void {
        this._dataService.getFeeBreakup(data).subscribe((res: any[]) => {
            this.studentsList = this.activeFeeService.getFeeByFrequancy(res);
            this.dataSource = new MatTableDataSource(this.studentsList);
            this.dataSource.paginator = this.paginator;
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });
    }

    selectUniversity(event) {
        this.prevObject.universityId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        this.getSchoolList({
            universityId: event || 0,
        });
    }

    selectSchool(event) {
        this.prevObject.schoolId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        this.schoolId = event;
        this.getdepartmentList(false, {
            schoolId: this.schoolId,
        });
    }

    selectDepartment(event) {
        this.prevObject.departmentId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        this.departmentId = event;
        this.getprogrammeList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        });
    }

    selectProgramme(event) {
        this.prevObject.programId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        this.programmeId = event;
        this.getSemesterList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
        });
    }

    selectSemester(event) {
        this.prevObject.semesterId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        if (this.semesterList.length) {
            this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, event);
        }
        this.semesterId = event;
        this.getDivisionList(false, {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        });
    }

    selectDivision(event) {
        this.prevObject.divisionId = event;
        sessionStorage.setItem('tempData', JSON.stringify(this.prevObject));
        this.divisionId = event;
        this.getFeeList({
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
            divisionId: this.divisionId
        })
    }

    openActiveFee(element) {
        const dialogRef = this.dialog.open(ActiveFeeModalComponent, {
            width: '800px',
            data: {...element}
        });
        const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const data = this.objectForm.value;
                const res = element.id.map(e => {
                    return {
                        userName: userDetails.userName,
                        feeTypeId: e,
                        ...result,
                        ...data,
                    }
                });
                this._dataService.addActiveFee(res).subscribe(res => {
                    this.router.navigate(['active-fee']);
                    this.toastr.success('Updated Sucessfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }
        });
    }

}
