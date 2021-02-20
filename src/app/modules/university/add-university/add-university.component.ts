import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalcommunicationService } from 'src/app/core/localcommunication.service';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-university',
    templateUrl: './add-university.component.html',
    styleUrls: ['./add-university.component.scss']
})
export class AddUniversityComponent implements OnInit {

    objectForm: FormGroup;
    universityList: Array<any> = [{}];
    editFlag: boolean = true;
    editData = [];
    schholName = '';
    id: number = 0;
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'universitys': new FormArray([
            ])
        });

        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.id = JSON.parse(sessionStorage.getItem('university')).id;
            let name = JSON.parse(sessionStorage.getItem('university')).universityName;
            (<FormArray>this.objectForm.get('universitys')).push(new FormControl(name, Validators.required));
        } else {
            (<FormArray>this.objectForm.get('universitys')).push(new FormControl(null, Validators.required));
        }
    }

    adduniversity() {
        this.universityList.push({});
        (<FormArray>this.objectForm.get('universitys')).push(new FormControl(null, Validators.required));
    }

    removeuniversity(index) {
        this.universityList.splice(index, 1);
        (<FormArray>this.objectForm.get('universitys')).removeAt(index);
    }


    onSubmit() {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            if (this.editFlag) {
                this._dataService.saveUniversity(this.objectForm.value.universitys).subscribe(res => {
                    this.router.navigate(['university']);
                    this.toastr.success('University details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.updateUniversity(this.id, this.objectForm.value.universitys).subscribe(res => {
                    this.router.navigate(['university']);
                    this.toastr.success('University details updated successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            }

        }
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

}
