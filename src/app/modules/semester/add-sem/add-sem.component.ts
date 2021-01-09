import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-add-sem',
  templateUrl: './add-sem.component.html',
  styleUrls: ['./add-sem.component.scss']
})
export class AddSemComponent implements OnInit {

  objectForm: FormGroup;
  schoolList:Array<any> = [];
  departmentList:Array<any> = [];
  programmeList:Array<any> = [];
  semesterList =[{}];
  schoolId:number = 0;
  departmentId:number = 0;
  programmeId:number = 0;
  constructor(private _dataService:UtilityServiceService) { }

  ngOnInit() {
    this.getSchoolList();
    this.getdepartmentList();
    this.getprogrammeList();
    this.objectForm = new FormGroup({
      'schoolName': new FormControl(null,Validators.required),
      'departmentName': new FormControl(null,Validators.required),
      'programmeName': new FormControl(null,Validators.required),
      'semester':new FormArray([
      ])
    });
    (<FormArray>this.objectForm.get('semester')).push(new FormControl());
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

  addSemester(){
        this.semesterList.push({});
        (<FormArray>this.objectForm.get('semester')).push(new FormControl(null, Validators.required));
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
  onSubmit(){
    let body = {};
    console.log(this.objectForm)
    if(this.objectForm.value.semester[0] === null){
      alert()
    }else{
       body = {
          "schoolId": this.schoolId,
          "departmentId":this.departmentId,
          'programId': this.programmeId,
          "semesterName": [...this.objectForm.value.semester]
      }
    }
    console.log(body)
    this._dataService.savesemester(body).subscribe(res=>{
      console.log(res,'res')
    })
  }

}
