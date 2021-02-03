
import { WindowRefService } from 'src/app/service/window-ref.service';
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
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-online',
    templateUrl: './online.component.html',
    styleUrls: ['./online.component.scss'],
    providers: [WindowRefService]
})
export class OnlineComponent implements OnInit {

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
    public paymentData: any;
    public updatedPrice: any = {};

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
        private toastr: ToastrService,
        public window: WindowRefService,
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
                status = 'No Active Fee';
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

    public confirmPaymentStatus(data) {
        this._dataService.onlinePayment(data).subscribe(e => {
            this.toastr.clear();
            this.toastr.success("Payment Recived", "Info");
            this._dataService.updateFeeCalculation(this.updatedPrice).subscribe(e => {
                this.getStudentList(false, {
                    divisionId: this.divisionId
                });
                this.updatedPrice = {};
            });
            this.toastr.clear();
            this.toastr.success("Payment Recived", "Info");
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message , "Info");
        })
    }

    public showStudentStatus(data) {
        const dialogRef = this.dialog.open(StudentStatusComponent, {
            width: '1200px',
            data: data.res
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const studentData = { ...result.studentData };
                this.updatedPrice = { ...result.updatedPrice };
                delete result.updatedPrice;
                delete result.studentData;

                console.log(result);
                this.paymentData = result;
                this._dataService.setOnlinePaymentOrder({
                    amount: result.amountReceived * 100
                }).subscribe(e => {
                    this.payWithRazor(result.amountReceived, e, studentData);
                });
            }
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


    payWithRazor(amount: number, orderId: string, student: any) {
        const options: any = {
            key: environment.razKeyId,
            amount: amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
            currency: 'INR',
            name: '', // company name or product name
            description: '',  // product description
            image: '', // company logo or product image
            order_id: orderId, // order_id created by you in backend 'order_GPgaDT83tTQ9HY'
            modal: {
                // We should prevent closing of the form when esc key is pressed.
                escape: false,
            },
            prefill: {
                name: student.firstName,
                email: student.emailId,
                contact: student.phoneNo
            },
            notes: {
                // include notes if any
            },
            theme: {
                color: '#0c238a'
            }
        };
        options.handler = ((response, error) => {
            options.response = response;
            this.paymentData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                studentId: this.paymentData.studentId,
                feeTypeId: this.paymentData.activateFeeId,
                amountReceived: this.paymentData.amountReceived,
                paymentReceivedBy: this.paymentData.paymentReceivedBy,
            }
            this.confirmPaymentStatus(this.paymentData);
        });
        options.modal.ondismiss = (() => {
            // handle the case when user closes the form while transaction is in progress
            this.toastr.error("Transaction cancelled.", "Info");
        });
        const rzp = new this.window.nativeWindow.Razorpay(options);
        rzp.open();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
