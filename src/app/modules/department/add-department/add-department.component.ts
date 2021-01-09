import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-department',
    templateUrl: './add-department.component.html',
    styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit, OnDestroy {

    objectForm: FormGroup;
    schoolList: Array<any> = [{}];
    departmentList: Array<any> = [{}];
    schoolId: number = 0;
    editFlag = true;
    id = 0;
    schoolName = '';
    departmentName = '';
    dprtObj;

    constructor(private _dataService: UtilityServiceService, private router: Router) { }

    ngOnInit() {
        this.getDepartment();
        this.objectForm = new FormGroup({
            'schoolName': new FormControl(null, Validators.required),
            'departments': new FormArray([])
        });
        // (<FormArray>this.objectForm.get('departments')).push(new FormControl());
        if (this.router.url.includes('edit')) {
            this.editFlag = false;
            this.dprtObj = JSON.parse(sessionStorage.getItem('dprtmnt'));
            this.id = this.dprtObj.id;
            (<FormArray>this.objectForm.get('departments')).push(new FormControl(this.dprtObj.departmentName));
        } else {
            (<FormArray>this.objectForm.get('departments')).push(new FormControl());
        }
    }

    getDepartment() {
        this._dataService.getSchoolList().subscribe(res => {
            this.schoolList = [...res];
            console.log(this.schoolList)
            if (this.router.url.includes('edit')) {

                this.schoolList.forEach(element => {
                    if (element.schoolName === this.dprtObj.schoolName) {
                        this.objectForm.get('schoolName').setValue(element.id);
                        this.schoolId = element.id;
                    }
                });
            } else {
                this.objectForm.get('schoolName').setValue(this.schoolList[1].id);
                this.schoolId = this.schoolList[0].id;
            }

        })
    }

    addDepartment() {
        this.departmentList.push({});
        (<FormArray>this.objectForm.get('departments')).push(new FormControl(null, Validators.required));
    }

    selectSchool(event) {
        this.schoolId = event;
    }

    onSubmit() {
        let body = {};
        if (this.objectForm.value.departments[0] === null) {
            alert()
        } else {
            body = {
                "departments": [...this.objectForm.value.departments],
                "schoolId": this.schoolId

            }
        }
        this._dataService.saveDepartment(body).subscribe(res => {
            console.log(res, 'res')
        })
    }

    update() {
        let body = {};
        body = {
            "departments": [...this.objectForm.value.departments],
            "schoolId": this.schoolId

        }
        this._dataService.updateDepartment(this.id, body).subscribe(res => {
            this.router.navigate(['department/view']);
            sessionStorage.clear();
        })
    }

    ngOnDestroy() {
        sessionStorage.clear();
    }

}
