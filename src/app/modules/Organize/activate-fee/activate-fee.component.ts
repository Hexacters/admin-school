import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-activate-fee',
  templateUrl: './activate-fee.component.html',
  styleUrls: ['./activate-fee.component.scss']
})
export class ActivateFeeComponent implements OnInit {
  objectForm: FormGroup;
  schoolList: Array<any> = [];
  departmentList: Array<any> = [];
  programmeList: Array<any> = [];
  semesterList = [];
  divisionList = [];
  typeList = [];
  feeList = [{}];
  feeTypeList = [{}];
  schoolId: number = 0;
  departmentId: number = 0;
  programmeId: number = 0;
  semesterId: number = 0;
  divisionId: number = 0;
  typeId: number = 0;
  bodyArray = [];
  frequency = [{'name':'Weekly'},{'name':'Monthly'},{'name':'Quartly'},{'name':'Half Yearly'},{'name':'Yearly'}]
  constructor(private _dataService: UtilityServiceService) { }

  ngOnInit() {
    this.getSchoolList();
    this.getdepartmentList();
    this.getprogrammeList();
    this.getSemesterList();
    this.getDivisionList();
    this.getType();
    this.objectForm = new FormGroup({
      'schoolName': new FormControl(null, Validators.required),
      'departmentName': new FormControl(null, Validators.required),
      'programmeName': new FormControl(null, Validators.required),
      'semesterName': new FormControl(null, Validators.required),
      'divisionName': new FormControl(null, Validators.required),
      'frequencyName': new FormControl(this.frequency[0].name, Validators.required),
      'billStartDt': new FormControl(null, Validators.required),
    });
  }

  getSchoolList() {
    this._dataService.getSchoolList().subscribe(res => {
      this.schoolList = [...res];
      this.objectForm.get('schoolName').setValue(this.schoolList[0].id);
      this.schoolId = this.schoolList[0].id;

    })
  }

  getdepartmentList() {
    this._dataService.getDepartmentList().subscribe(res => {
      this.departmentList = [...res];
      this.objectForm.get('departmentName').setValue(this.departmentList[0].id);
      this.departmentId = this.departmentList[0].id;
      console.log(res, 'department')
    })
  }
  getprogrammeList() {
    this._dataService.getProgrammeList().subscribe(res => {
      this.programmeList = [...res];
      this.objectForm.get('programmeName').setValue(this.programmeList[0].id);
      this.programmeId = this.programmeList[0].id;
      console.log(res, 'department')
    })
  }

  getSemesterList() {
    this._dataService.getsemesterList().subscribe(res => {
      this.semesterList = [...res];
      this.objectForm.get('semesterName').setValue(this.semesterList[0].id);
      this.semesterId = this.semesterList[0].id;
      console.log(res, 'department')
    })
  }

  getDivisionList() {
    this._dataService.getDivisionList().subscribe(res => {
      this.divisionList = [...res];
      this.objectForm.get('divisionName').setValue(this.divisionList[0].id);
      this.divisionId = this.divisionList[0].id;
      console.log(res, 'department')
    })
  }

  getType() {
    this._dataService.getFeetypeList().subscribe(res => {
      this.typeList = [...res];
    })
  }

  selectSchool(event) {
    this.schoolId = event;
    console.log(event)
  }
  selectDepartment(event) {
    this.departmentId = event;
  }
  selectProgramme(event) {
    this.programmeId = event;
  }
  selectSemester(event) {
    this.semesterId = event;
  }
  selectDivision(event) {
    this.divisionId = event;
  }
  selectType(event){
   
    console.log(event)
  }
  selectFrequency(event){
    this.typeId = event;
  }

  onSubmit() {
    for (let i = 0; i < this.objectForm.value.feeType.length; i++) {
      const element = this.objectForm.value.feeType[i];
      this.bodyArray.push({
        "schoolId":this.schoolId,
        "departmentId": this.departmentId,
        "programId": this.programmeId,
        "semesterId": this.semesterId,
        "divisionId": this.divisionId,
        "typeId":  element,
        "feeType": this.typeId,
        "fee": this.objectForm.value.fee[i]
      })
    }

    console.log(this.bodyArray)
    this._dataService.saveFee(this.bodyArray).subscribe(res => {
      console.log(res, 'res')
      this.objectForm.reset();
      this.bodyArray = [];
      this.feeList = [{}];
      this.feeTypeList = [{}];
    })
  }

  getfromDate(){}

}
