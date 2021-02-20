import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
    
    rollNo:'';
    public studentData: any = {};
    public studentPaymentData: any = {};
    public searching: boolean = false;
    public isStudentReport: boolean = false;

    objectForm: FormGroup;
    customeDateRange: any;
    universityList: Array<any> = [];
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [];
    semesterList = [];
    divisionList = [];
    typeList = [];

    universityId: number = 0;
    schoolId: number = 0;
    departmentId: number = 0;
    programmeId: number = 0;
    semesterId: number = 0;
    divisionId: number = 0;
    typeId: string = '';
    public isSUadmin: boolean = false;
    public paymentStatus: any = {};
    public isNodivision: boolean = false;

    displayedColumns1: string[] = ['index','typeName', 'feeType', 'maxTerm','maxDueDate','universityName', 'schoolName','departmentName', 'programName','semesterName', 'divisionName', 'activateFee'];
    displayedColumns2: string[] = ['index', 'calculatedAmount', 'isAdd', 'netAmount', 'scholarShipAmount'];
    displayedColumns3: string[] = ['index', 'transactionId', 'paymentReceivedOn', 'paymentReceivedBy', 'amountReceived','paymentMode','penaltyAmount', 'paymentStatus'];
    dataSource1: MatTableDataSource<any>;
    dataSource2: MatTableDataSource<any>;
    dataSource3: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ){

    }

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
        this.paymentStatus = req;

        this._dataService.getReportFeeStatus(req).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
        })
        this.getPaymentStatus({
            fromDate: moment('01-01-0001').format('YYYY/MM/DD'),
            toDate: moment().format('YYYY/MM/DD'),
        });
        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, Validators.required),
            'frequencyStop': new FormControl('', Validators.required),
            'schoolName': new FormControl('', Validators.required),
            'departmentName': new FormControl('', Validators.required),
            'programmeName': new FormControl('', Validators.required),
            'semesterName': new FormControl('', Validators.required),
            'divisionName': new FormControl('', Validators.required),
        });
    }

    onDateChange(event) {
        this.customeDateRange = event.value;
        this.getPaymentStatus({
            fromDate: this.customeDateRange.begin.format('YYYY/MM/DD'),
            toDate: this.customeDateRange.end.format('YYYY/MM/DD')
        });
    }

    getPaymentStatus(data?) {
        let rr = {};
        if (data) {
            rr = {
                fromDate: data.fromDate,
                toDate: data.toDate,
                ...this.paymentStatus
            }
        }
        this._dataService.getReportPaymentStatus(rr).subscribe(res => {
            this.dataSource3 = new MatTableDataSource(res);
            this.dataSource3.paginator = this.paginator;
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
    getdepartmentList(data?): void {
        this._dataService.getDepartmentList(data).subscribe(res => {
            this.departmentList = [...res];
        });
    }

    getprogrammeList(data?): void {
        this._dataService.getProgrammeList(data).subscribe(res => {
            this.programmeList = [...res];
        });
    }

    getSemesterList(data?): void {
        this._dataService.getsemesterList(data).subscribe(res => {
            this.semesterList = [...res];
        });
    }

    getDivisionList(data?): void {
        this._dataService.getDivisionList(data).subscribe(res => {
            this.divisionList = [...res];
            if (this.isNodivision) {
                const id =  res[0].id
                this.objectForm.patchValue({
                    divisionName: id
                });
                this.selectDivision(id);
            }
        });
    }

    selectUniversity(event) {
        this.universityId=event;
        this.getSchoolList({
            universityId: event || 0,
        });
        this.objectForm.patchValue({
            schoolName: ''
        });
        this._dataService.getReportFeeStatus({
            universityId:this.universityId
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    selectSchool(event) {
        this.schoolId = event;
        this.getdepartmentList({
            schoolId: this.schoolId,
        });
        this._dataService.getReportFeeStatus({
            universityId:this.universityId,
            schoolId: this.schoolId,
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    selectDepartment(event) {
        this.departmentId = event;
        this.getprogrammeList({
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        });
        this._dataService.getReportFeeStatus({
            universityId:this.universityId,
            schoolId: this.schoolId,
            departmentId: this.departmentId,
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    selectProgramme(event) {
        this.programmeId = event;
        this.getSemesterList({
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
        });
        this._dataService.getReportFeeStatus({
            universityId:this.universityId,
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    selectSemester(event) {
        this.semesterId = event;
        this.isNodivision = this._dataService.isNodivisionSem(this.semesterList, event);
        this.getDivisionList({
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        });
        this._dataService.getReportFeeStatus({
            universityId:this.universityId,
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    selectDivision(event) {
        this.divisionId = event;
        this._dataService.getReportFeeStatus({
            universityId:this.universityId,
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            programId: this.programmeId,
            semesterId: this.semesterId,
            divisionId: event
        }).subscribe(res => {
            this.dataSource1 = new MatTableDataSource(res);
            this.dataSource1.paginator = this.paginator;
            console.log('First table');
            console.log(res);
        })
    }

    applyFilter1(filterValue: string) {
        this.dataSource1.filter = filterValue.trim().toLowerCase();
        if (this.dataSource1.paginator) {
            this.dataSource1.paginator.firstPage();
        }
    }

    applyFilter3(filterValue: string) {
        this.dataSource3.filter = filterValue.trim().toLowerCase();
        if (this.dataSource3.paginator) {
            this.dataSource3.paginator.firstPage();
        }
    }

    onSearch(){
        this.searching=true;
        this._dataService.getReportStudent({rollNo:this.rollNo}).subscribe(res => {
            console.log('Student');
            console.log(res);
            if(res.studentsReport){
                this.studentData=res.studentsReport;
                this.studentPaymentData = res.studentsPaymentStatusList;
                this.isStudentReport=true;
            }
            else{
                this.isStudentReport=false;
            }
            this.searching=false;
            console.log(this.studentPaymentData);
        })
    }
}