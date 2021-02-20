import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-admin',
    templateUrl: './add-admin.component.html',
    styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

    penaltyForm: FormGroup;
    adminList: Array<any> = [];
    universityList: Array<any> = [];
    editFlag: boolean = false;
    isSUAdmin: boolean = false;
    userDetails: any = {};
    editData: object = {};
    frequency = [{ 'name': 'Weekly' }, { 'name': 'Monthly' }, { 'name': 'Quartly' }, { 'name': 'Half Yearly' }, { 'name': 'Yearly' }]

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) {

    }

    ngOnInit() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}') || {};
        this.isSUAdmin = this._dataService.isSuperAdmin();
        if (this.router.url.includes('su') || !this.isSUAdmin) {
            this.isSUAdmin = true;
        } else {
            this.getUniversity();
            this.isSUAdmin = false;
        }
        this.penaltyForm = new FormGroup({
            'admin': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.editFlag = true;
            this.editData = JSON.parse(sessionStorage.getItem('admin'));
            this.onAdd(this.editData);
        } else {
            this.onAdd();
        }
    }

    public getPenalty(data) {
        const id = this.userDetails.universityId || '';
        return new FormGroup({
            'name': new FormControl(data['name'] || '', Validators.required),
            'universityId': new FormControl(data['universityId'] || id),
            'password': new FormControl(data['password'] || ''),
            'emailId': new FormControl(data['emailId'] || '', Validators.email),
            'phoneNo': new FormControl(data['phoneNo'] || '', Validators.required),
            'role': new FormControl((this.isSUAdmin && this.router.url.includes('su')) ? 'superAdmin' : 'admin', Validators.required),
        })
    }

    public onAdd(data = {}) {
        this.adminList.push(data);
        (<FormArray>this.penaltyForm.get('admin')).push(this.getPenalty(data));
    }

    public onRemove(i) {
        this.adminList.splice(i, 1);
        (<FormArray>this.penaltyForm.get('admin')).removeAt(i);
    }

    onSubmit() {
        this.penaltyForm.markAllAsTouched();
        if (this.penaltyForm.valid) {
            const penalityForm = this.penaltyForm.value;
            penalityForm.admin = penalityForm.admin.map(e => {
                e.username = e.emailId;
                return e;
            });
            this._dataService.saveAdmin(penalityForm.admin).subscribe(res => {
                this.router.navigate(['/admin']);
                this.toastr.success('Admin details saved successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
    }

    onUpdate() {
        this.penaltyForm.markAllAsTouched();
        if (this.penaltyForm.valid) {
            const penalityForm = this.penaltyForm.value;
            penalityForm.admin[0].username =  penalityForm.admin[0].emailId;
            delete penalityForm.admin[0].password;
            this._dataService.updateAdmin(this.editData['id'], penalityForm.admin[0]).subscribe(res => {
                this.router.navigate(['/admin']);
                this.toastr.success('Admin details updated successfully', 'Info');
            }, (res: HttpErrorResponse) => {
                this.toastr.error(res.error.message || res.message, 'Info');
            });
        }
    }

}
