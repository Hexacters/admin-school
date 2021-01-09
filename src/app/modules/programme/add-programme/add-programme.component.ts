import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-add-programme',
    templateUrl: './add-programme.component.html',
    styleUrls: ['./add-programme.component.scss']
})
export class AddProgrammeComponent implements OnInit {


    objectForm: FormGroup;
    schoolList: Array<any> = [];
    departmentList: Array<any> = [];
    programmeList: Array<any> = [{}];
    schoolId: number = 0;
    departmentId: number = 0;
    isEdit: boolean = false;
    public editData: object = {};

    constructor(private _dataService: UtilityServiceService, private router: Router) { }

    ngOnInit() {
        this._dataService.getSchoolList().subscribe(res => {
            this.schoolList = [...res];
            if (!this.router.url.includes('edit')) {
                this.schoolId = this.schoolList[0].id;
                this.objectForm.get('schoolName').setValue(this.schoolList[0].id);
            }
        });

        this._dataService.getDepartmentList().subscribe(res => {
            this.departmentList = [...res];
            if (!this.router.url.includes('edit')) {
                this.objectForm.get('departmentName').setValue(this.departmentList[0].id);
                this.departmentId = this.departmentList[0].id;
            }
        });

        this.objectForm = new FormGroup({
            'schoolName': new FormControl(null, Validators.required),
            'departmentName': new FormControl(null, Validators.required),
            'programme': new FormArray([])
        });

        if (this.router.url.includes('edit')) {
            this.isEdit = true;
            this.editData = JSON.parse(sessionStorage.getItem('programm'));
            this.departmentId = this.editData['departmentId'];
            this.schoolId = this.editData['schoolId'];
            this.objectForm.patchValue({
                schoolName: this.schoolId,
                departmentName: this.departmentId,
                programme: []
            });
            (<FormArray>this.objectForm.get('programme')).push(new FormControl(this.editData['programName']));
        } else {
            (<FormArray>this.objectForm.get('programme')).push(new FormControl());
        }


        this.objectForm.patchValue({})
    }

    addprogramme() {
        this.programmeList.push({});
        (<FormArray>this.objectForm.get('programme')).push(new FormControl(null, Validators.required));
    }

    selectSchool(event) {
        this.schoolId = event;
    }

    selectDepartment(event) {
        this.departmentId = event;
    }

    onSubmit(isUpdate: boolean): void {
        let body = {};
        console.log(this.objectForm)
        if (this.objectForm.value.programme[0] === null) {
            alert()
        } else {
            body = {
                "programName": [...this.objectForm.value.programme],
                "schoolId": this.schoolId,
                "departmentId": this.departmentId
            }
        }
        console.log(body)
        if (isUpdate) {
            this._dataService.updateProgramme(this.editData['id'], body).subscribe(res => {
                this.router.navigate(['/programm/view']);
            });

            return;
        }
        this._dataService.saveProgramme(body).subscribe(res => {
            this.router.navigate(['/programm/view']);
        });
    }

}
