import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ActiveFeeService } from '../../active-fee/active-fee.service';

@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

    public studentData: any = {};
    public price: any = {};

    public paymentList = [];
    public paymentHistory = [];
    public activeFee = [];
    public feeList = [];
    public feeBreakup = [];
    public schBreakup = [];
    public isPaymentView: boolean = false;
    public selectedFee = [];
    public user: any = {};
    public paymentMode: string = '';

    @Output() sendData = new EventEmitter<any>();

    @Input() public data;

    constructor(
        private toastr: ToastrService,
        public activeFeeService: ActiveFeeService,
    ) { }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('userDetails'));
        console.log(this.data)
        this.studentData = this.data.student;
        this.paymentList = [...this.data.paymentList];
        this.price = this.data.priceCalculation;
        this.feeBreakup = this.data.feeBreakup;
        this.activeFee = this.data.activeFee.map(e => {
            const feeData = this.feeBreakup.find(fee => e.feeTypeId === fee.id)
            return {
                type: feeData.typeId,
                typeName: feeData.type,
                ...e
            }
        }).filter(e => {
            return !this.paymentList.map(e => e.activateFeeID).includes(e.id);
        });

        this.feeList = this.activeFeeService.getFeeByFrequancy(this.activeFee);

        this.schBreakup = this.data.scholarshipBreakup;
        this.paymentHistory = this.groupByTransaction([...this.data.paymentList]);

        this.calculateAmount();
    }

    groupByTransaction(data) {
        const result = [];
        const allData = {};
        data.forEach(e => {
            if (!allData[e.transactionId]) {
                allData[e.transactionId] = [];
            }
            allData[e.transactionId].push(e);
        });
        for (let key in allData) {
            result.push(allData[key][0]);
        }
        console.log(result)
        return result;
    }

    public get totalAmount() {
        let amount = 0;
        this.selectedFee.forEach(res => {
            if (res.isReson) {
                if (!res.isAdd) {
                    amount = amount - +res.fee - (res.scholarship && +res.scholarship.value || 0);
                    return;
                }
            }
            amount += +res.fee - (res.scholarship && +res.scholarship.value || 0);
        });
        return amount;
    }

    calculateAmount() {
        this.selectedFee = [];
        this.activeFee.forEach(res => {
            this.showPaymentView(res);
        });
        if (this.price && this.price.reasonAmount) {
            this.selectedFee.push({
                isReson: true,
                isAdd: this.price.isAdd,
                typeName: this.price.reason,
                fee: this.price.reasonAmount || 0,
            });
        }
        this.isPaymentView = false;
    }

    showAllPayment() {
        this.isPaymentView = true;
        this.selectedFee = [];
        this.activeFee.forEach(res => {
            this.showPaymentView(res);
        });
        if (this.price.reasonAmount) {
            this.selectedFee.push({
                isReson: true,
                isAdd: this.price.isAdd,
                typeName: this.price.reason,
                fee: this.price.reasonAmount || 0,
            });
        }
    }

    updateSelectedFee(data) {
        this.selectedFee = [];
        this.activeFee.filter(e => data.id.includes(e.id)).forEach(res => {
            this.showPaymentView(res);
        });
    }

    showPaymentView(activeFee, isSingle = false) {
        if (isSingle) {
            this.selectedFee = [];
        }
        this.isPaymentView = true;

        activeFee.scholarship = this.schBreakup.find(e => {
            return e.typeId == activeFee.type
        });
        this.selectedFee.push(activeFee);

        if (activeFee.penaltyAmount) {
            const calc = this.activeFeeService.getPanalityDays(activeFee);
            if (!calc) {
                return;
            }
            this.selectedFee.push({
                isPenalty: true,
                typeName: `${activeFee.typeName} Penalty (Per ${activeFee.frequency} = ${activeFee.penaltyAmount})`,
                fee: calc * (activeFee.penaltyAmount || 0),
            });
        }

        return activeFee;
    }

    payNow() {
        let penaltyAmount = 0;
        this.selectedFee.forEach(res => {
            if (res.isPenalty) {
                penaltyAmount += +res.fee;
            }
            if (res.isReson) {
                if (this.price.reasonAmount) {
                    this.price.reasonAmount -= res.fee || 0;
                } else {
                    this.price.reasonAmount = 0;
                }
            } else {
                this.price.calculatedAmount -= res.fee || 0;
            }
            this.price.scholarShipAmount -= (res.scholarship && +res.scholarship.value || 0)
            this.price.netAmount = this.price.calculatedAmount - this.price.scholarShipAmount;
            if (!this.price.isAdd) {
                this.price.netAmount -= this.price.reasonAmount || 0;
            }
            this.price.netAmount += (this.price && this.price.reasonAmount || 0);
            if (this.price.netAmount < 0) {
                this.price.netAmount = 0;
            }
        });
        if (!this.totalAmount) {
            this.toastr.error("Payment not available for this amount", 'Info');
            return;
        }
        const result = {
            updatedPrice: this.price,
            studentData: this.studentData,
            studentId: this.studentData.id,
            paymentMode: this.paymentMode,
            paymentReceivedBy: this.user.userName,
            paymentReceivedOn: moment().toDate(),
            transactionId: moment().valueOf(),
            penaltyAmount: penaltyAmount,
            amountReceived: this.totalAmount,
            activateFeeId: this.selectedFee.map(e => {
                return e.id || 0
            }).join(',')
        }
        this.sendData.emit(result);
    }

}
