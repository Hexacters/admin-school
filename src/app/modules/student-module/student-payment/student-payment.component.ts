import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WindowRefService } from 'src/app/service/window-ref.service';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-student-payment',
    templateUrl: './student-payment.component.html',
    styleUrls: ['./student-payment.component.scss']
})
export class StudentPaymentComponent implements OnInit {

    public userDetails: any = {};
    public data: any = null;
    public paymentData: any;
    public updatedPrice: any = {};

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService,
        public window: WindowRefService,
    ) { }

    ngOnInit() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const studentId = this.userDetails.userId;
        this._dataService.getPaymentStatusByStudent({ studentId }).subscribe(e => {
            this.data = e;
        });
    }

    paynow(result) {
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
                paymentMode: this.paymentData.paymentMode,
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

    public confirmPaymentStatus(data) {
        this._dataService.onlinePayment(data).subscribe(e => {
            this.toastr.clear();
            this.toastr.success("Payment Recived", "Info");
            this._dataService.updateFeeCalculation(this.updatedPrice).subscribe(e => {
                this.updatedPrice = {};
                window.location.reload()
            });
            this.toastr.clear();
            this.toastr.success("Payment Recived", "Info");
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message , "Info");
        })
    }

}
