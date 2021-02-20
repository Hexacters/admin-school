import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';
import * as moment from 'moment';
import { StudentStatusComponent } from '../../dailog/student-status/student-status.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-offline',
    templateUrl: './offline.component.html',
    styleUrls: ['./offline.component.scss']
})
export class OfflineComponent implements OnInit {

    studentForm: FormGroup;
    public selectedFeeType = {};
    public universityList: Array<any>;
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
    public isNodivision: boolean = false;
    public isSUadmin: boolean = false;
    public prevObject: any = {};

    displayedColumns: string[] = ['index', 'schoolName', 'studentName', 'dueDate', 'netAmount', 'update'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

    paginator: MatPaginator;

    @ViewChild('matPaginator', { static: false }) set setPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.isSUadmin = this._dataService.isSuperAdmin();
        const id = this._dataService.currentUniversity() || '0';
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
            'schoolId': new FormControl('0', Validators.required),
            'universityId': new FormControl(id, Validators.required),
            'departmentId': new FormControl('0', Validators.required),
            'programId': new FormControl('0', Validators.required),
            'semesterId': new FormControl('0', Validators.required),
            'divisionId': new FormControl('0', Validators.required),
            'students': new FormArray([])
        });
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
            this.studentForm.patchValue({
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
            const tempData = JSON.parse(sessionStorage.getItem('tempData'));
            if (tempData && tempData.semesterId) {
                this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, tempData.semesterId);
            }
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
                const tempData = JSON.parse(sessionStorage.getItem('tempData'));
                if (tempData && isEdit) {
                    this.selectDivision(tempData.divisionId);
                } else {
                    this.selectDivision(0);
                }
            }
        });
    }

    getStudentList(isEdit: boolean = false, data?): void {
        this._dataService.getPaymentStatus(data).subscribe(res => {
            this.studentsList = this.normalizeData(res.totalPaymentStudentList);
            this.dataSource = new MatTableDataSource(this.studentsList);
            this.dataSource.paginator = this.paginator;
        });
    }

    public sortBasedOnDate(data: string[]): string[] {
        return data.sort(
            (a, b) => moment(b).valueOf() - moment(a).valueOf()
        );
    }

    public getLastDueDate(fee, payment, price) {
        let activeFee = fee.filter(e => !payment.map(e => e.activateFeeID).includes(e.id))
        if (fee.length && payment.length && !activeFee.length && !price.resoneAmount) {
            return {
                dueDate: '-',
                isPayable: false,
                isPaided: true,
                status: 'Payment Recived'
            }
        }
        return {
            dueDate: moment(fee.activationDate).format('DD-MM-YYYY'),
            isPayable: true,
            isPaided: false,
            status: 'Pay Now'
        }
    }

    public normalizeData(data: any[]) {
        const response = [];
        let isPayable, status, dueDate, isPaided;
        data.forEach(res => {
            if (res.activeFee && res.activeFee.length) {
                let data = this.getLastDueDate(res.activeFee, res.paymentList, res.priceCalculation);
                isPaided = data.isPaided;
                isPayable = data.isPayable;
                dueDate = data.dueDate;
                status = data.status;
            } else {
                isPaided = false;
                isPayable = false;
                dueDate = '-';
                status = 'No Activate Fee';
            }

            const object = {
                studentName: `${res.student.firstName} ${res.student.lastName}`,
                schoolName: `${res.student.schoolName}`,
                netAmount: res.priceCalculation ? `${res.priceCalculation.netAmount}` : 0,
                dueDate,
                status,
                isPaided,
                isPayable,
                res
            }
            response.push(object);
        });
        return response;
    }

    public showStudentStatus(data) {
        const dialogRef = this.dialog.open(StudentStatusComponent, {
            width: '1200px',
            data: { 
                isOffline: true,
                ...data.res
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const studentData = { ...result.studentData };
                const price = { ...result.updatedPrice };
                delete result.studentData;
                delete result.updatedPrice;

                this._dataService.offlinePayment(result).subscribe(e => {
                    this._dataService.updateFeeCalculation(price).subscribe(e => {
                        this.getStudentList(false, {
                            divisionId: this.divisionId
                        });
                    });
                    this.toastr.clear();
                    this.toastr.success("Payment Recived", "Info");
                });
            }
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
        this.getStudentList(false, {
            divisionId: this.divisionId
        });
    }

    public selectType(value, index: number = 0): void {
        this.selectedFeeType[index] = value;
    }

    updateFee(data) {
        sessionStorage.setItem('feeCalculation', JSON.stringify(data));
        this.router.navigate(['fee-calculation/update']);
    }

    viewFee(data) {
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
