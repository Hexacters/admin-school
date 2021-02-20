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
export class SchoolComponent implements OnInit, OnDestroy {

    objectForm: FormGroup;
    SchoolList: Array<any> = [{}];
    editFlag: boolean = true;
    isSUadmin: boolean = false;
    editData = [];
    schholName = '';
    universityId: number;
    id: number = 0;
    universityList: any[] = [];
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.isSUadmin = this._dataService.isSuperAdmin();
        const id = this._dataService.currentUniversity() || '';
        this.objectForm = new FormGroup({
            'universityId': new FormControl(id, this.isSUadmin ? Validators.required : null),
            'schools': new FormArray([
            ])
        });
        const prevData = JSON.parse(sessionStorage.getItem('by-university'));

        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.id = JSON.parse(sessionStorage.getItem('school')).id;
            let name = JSON.parse(sessionStorage.getItem('school')).schoolName;
            this.universityId  = JSON.parse(sessionStorage.getItem('school')).universityId;
            this.objectForm.patchValue({
                universityId: this.universityId
            });
            (<FormArray>this.objectForm.get('schools')).push(new FormControl(name, Validators.required));
        } else {
            if (prevData) {
                this.objectForm.patchValue({
                    universityId: prevData.id
                });
            }
            (<FormArray>this.objectForm.get('schools')).push(new FormControl(null, Validators.required));
        }
        if (this.isSUadmin) {
            this.getUniversity();
        } else {
            this.selectUniversity(id);
        }
    }

    getUniversity() {
        this._dataService.getUniversityList().subscribe(e => {
            this.universityList = e;
        })
    }

    addSchool() {
        this.SchoolList.push({});
        (<FormArray>this.objectForm.get('schools')).push(new FormControl(null, Validators.required));
    }

    selectUniversity(event) {
        this.universityId = event;
    }

    removeSchool(index) {
        this.SchoolList.splice(index, 1);
        (<FormArray>this.objectForm.get('schools')).removeAt(index);
    }


    onSubmit() {
        this.objectForm.markAllAsTouched();
        if (this.objectForm.valid) {
            if (this.editFlag) {
                this._dataService.saveSchool(this.objectForm.value).subscribe(res => {
                    this.router.navigate(['school']);
                    this.toastr.success('School details saved successfully', 'Info');
                }, (res: HttpErrorResponse) => {
                    this.toastr.error(res.error.message || res.message, 'Info');
                });
            } else {
                this._dataService.updateSchool(this.id, this.objectForm.value).subscribe(res => {
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
