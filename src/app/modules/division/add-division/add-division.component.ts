import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.scss']
})
export class AddDivisionComponent implements OnInit {
  objectForm: FormGroup;
  schoolList:Array<any> = [];
  departmentList:Array<any> = [];
  programmeList:Array<any> = [];
  semesterList =[];
  divisionList=[{}];
  schoolId:number = 0;
  departmentId:number = 0;
  programmeId:number = 0;
  semesterId:number = 0;
  constructor(private _dataService:UtilityServiceService) { }

  ngOnInit() {
    this.getSchoolList();
    this.getdepartmentList();
    this.getprogrammeList();
    this.getSemesterList();
    this.objectForm = new FormGroup({
      'schoolName': new FormControl(null,Validators.required),
      'departmentName': new FormControl(null,Validators.required),
      'programmeName': new FormControl(null,Validators.required),
      'semesterName': new FormControl(null,Validators.required),
      'division':new FormArray([
      ])
    });
    (<FormArray>this.objectForm.get('division')).push(new FormControl());
  }

  getSchoolList(){
    this._dataService.getSchoolList().subscribe(res=>{
      this.schoolList = [...res];
      this.objectForm.get('schoolName').setValue(this.schoolList[0].id);
      this.schoolId = this.schoolList[0].id;
      
    })
  }

  getdepartmentList(){
    this._dataService.getDepartmentList().subscribe(res =>{
      this.departmentList = [...res];
      this.objectForm.get('departmentName').setValue(this.departmentList[0].id);
      this.departmentId = this.departmentList[0].id;
      console.log(res,'department')
    })
  }
  getprogrammeList(){
    this._dataService.getProgrammeList().subscribe(res =>{
      this.programmeList = [...res];
      this.objectForm.get('programmeName').setValue(this.programmeList[0].id);
      this.programmeId = this.programmeList[0].id;
      console.log(res,'department')
    })
  }

  getSemesterList(){
    this._dataService.getsemesterList().subscribe(res =>{
      this.semesterList = [...res];
      this.objectForm.get('semesterName').setValue(this.semesterList[0].id);
      this.semesterId = this.semesterList[0].id;
      console.log(res,'department')
    })
  }

  addDivision(){
        this.divisionList.push({});
        (<FormArray>this.objectForm.get('division')).push(new FormControl(null, Validators.required));
  }
  selectSchool(event){
    this.schoolId = event;
    console.log(event)
  }
  selectDepartment(event){
    this.departmentId = event;
    console.log(event)
  }
  selectProgramme(event){
    this.programmeId = event;
    console.log(event)
  }
  selectSemester(event){
    this.semesterId = event;
    console.log(event)
  }

  onSubmit(){
    let body = {};
    console.log(this.objectForm)
    if(this.objectForm.value.division[0] === null){
      alert()
    }else{
       body = {
          "schoolId": this.schoolId,
          "departmentId":this.departmentId,
          'programId': this.programmeId,
          "semesterId": this.semesterId,
          "divisionName": [...this.objectForm.value.division]
      }
    }
    console.log(body)
    this._dataService.saveDivision(body).subscribe(res=>{
      console.log(res,'res')
    })
  }

}
