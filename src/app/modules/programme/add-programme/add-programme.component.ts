import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-add-programme',
  templateUrl: './add-programme.component.html',
  styleUrls: ['./add-programme.component.scss']
})
export class AddProgrammeComponent implements OnInit {

 
  objectForm: FormGroup;
  schoolList:Array<any> = [];
  departmentList:Array<any> = [];
  programmeList:Array<any> = [{}];
  schoolId:number = 0;
  departmentId:number = 0;
  constructor(private _dataService:UtilityServiceService) { }

  ngOnInit() {
    this._dataService.getSchoolList().subscribe(res=>{
      this.schoolList = [...res];
      this.objectForm.get('schoolName').setValue(this.schoolList[0].id);
      this.schoolId = this.schoolList[0].id;
      
    })
    this._dataService.getDepartmentList().subscribe(res =>{
      this.departmentList = [...res];
      this.objectForm.get('departmentName').setValue(this.departmentList[0].id);
      this.departmentId = this.departmentList[0].id;
      console.log(res,'department')
    })
    this.objectForm = new FormGroup({
      'schoolName': new FormControl(null,Validators.required),
      'departmentName': new FormControl(null,Validators.required),
      'programme':new FormArray([
      ])
    });
    (<FormArray>this.objectForm.get('programme')).push(new FormControl());
  }

  ngAfterViewInit(){
    
  }
  addprogramme(){
        this.programmeList.push({});
        (<FormArray>this.objectForm.get('programme')).push(new FormControl(null, Validators.required));
  }
  selectSchool(event){
    this.schoolId = event;
    console.log(event)
  }
  selectDepartment(event){
    this.departmentId = event;
    console.log(event)
  }
  onSubmit(){
    let body = {};
    console.log('ng sebmit called')
    console.log(this.objectForm)
    if(this.objectForm.value.programme[0] === null){
      alert()
    }else{
       body = {
          "programName": [...this.objectForm.value.programme],
          "schoolId": this.schoolId,
          "departmentId":this.departmentId
      }
    }
    console.log(body)
    this._dataService.saveProgramme(body).subscribe(res=>{
      console.log(res,'res')
    })
  }

}
