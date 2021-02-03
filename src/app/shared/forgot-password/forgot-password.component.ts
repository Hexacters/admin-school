import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    email = '';
    public mailSend: boolean = false;

    constructor(
        private service: UtilityServiceService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        this.service.forgotPassword({mail: this.email}).subscribe(e => {
            this.mailSend = true;
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || "Please check your mail", 'Info');
        });
    }

}
