import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlName, RequiredValidator, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalcommunicationService } from 'src/app/core/localcommunication.service';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-school',
    templateUrl: './school.component.html',
    styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit, AfterViewInit, OnDestroy {

    objectForm: FormGroup;
    SchoolList: Array<any> = [{}];
    editFlag: boolean = true;
    editData = [];
    schholName = '';
    id: number = 0;
    constructor(
        private _dataService: UtilityServiceService,
        private _localCommunication: LocalcommunicationService,
        private router: Router,
        private toastr: ToastrService
    ) {

    }

    ngOnInit() {
        this.objectForm = new FormGroup({
            'schools': new FormArray([
            ])
        });

        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.id = JSON.parse(sessionStorage.getItem('school')).id;
            let name = JSON.parse(sessionStorage.getItem('school')).schoolName;
            (<FormArray>this.objectForm.get('schools')).push(new FormControl(name, Validators.required));
        } else {
            (<FormArray>this.objectForm.get('schools')).push(new FormControl(null, Validators.required));
        }
    }

    ngAfterViewInit() {

    }


    addSchool() {
        this.SchoolList.push({});
        (<FormArray>this.objectForm.get('schools')).push(new FormControl(null, Validators.required));
    }

    removeSchool(index) {
        this.SchoolList.splice(index, 1);
        (<FormArray>this.objectForm.get('schools')).removeAt(index);
    }


    onSubmit() {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            if (this.editFlag) {
                this._dataService.saveSchool(this.objectForm.value.schools).subscribe(res => {
                    this.router.navigate(['school']);
                    this.toastr.success('School details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.updateSchool(this.id, this.objectForm.value.schools).subscribe(res => {
                    this.router.navigate(['school']);
                    this.toastr.success('School details updated successfully', 'Info');
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
