import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActiveFeeService } from 'src/app/modules/active-fee/active-fee.service';
import { ActiveFeeModalComponent } from 'src/app/modules/active-fee/modal/active-fee-modal/active-fee-modal.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() toggleSide: EventEmitter<any> = new EventEmitter();
    public userDetails: object = {};
    public notification: boolean = true;
    public total_notify: number = 3;
    public notifictionsList: any = [];
    public isAdminUser: boolean = false;

    constructor(
        private router: Router,
        private _dataService: UtilityServiceService,
        public dialog: MatDialog,
        private toastr: ToastrService,
        public activeFeeService: ActiveFeeService
    ) { }

    ngOnInit() {
        this.isAdminUser = this._dataService.isAdmin;
        this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getNotification(req).subscribe(data => {
            const resp = this.activeFeeService.getFeeByFrequancy(data.map(e => {
                return {
                    activationDate: e.maxDueDate,
                    type: e.typeName,
                    ...e
                }
            }), 'divisionId');
            this.notifictionsList = resp.map(e => {
                return {
                    title: e.type,
                    description: `${e.feeType} (₹ ${e.fee})`,
                    ...e
                }
            });
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
                const data = {
                    schoolId: element.others.schoolId,
                    departmentId: element.others.departmentId,
                    programId: element.others.programId,
                    semesterId: element.others.semesterId,
                    divisionId: element.others.divisionId,
                }
                const res = element.id.map(e => {
                    console.log(element)
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
                    if (res.status === 500) {
                        this.toastr.error('Something went wrong', 'Info');
                    } else {
                        this.toastr.error(res.error.message || res.message, 'Info');
                    }
                });
            }
        });
    }

    toggleSideBar() {
        this.toggleSide.emit();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);

    };

    goToHome() {
        this.router.navigate(['/dashboard'])
    }

    goToChangePassword() {
        this.router.navigate(['/change-password'])
    }

    logOut() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login'])
    }

}
