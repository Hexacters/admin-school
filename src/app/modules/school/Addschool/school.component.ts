import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlName, RequiredValidator, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalcommunicationService } from 'src/app/core/localcommunication.service';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit, AfterViewInit, OnDestroy{
 
  objectForm: FormGroup;
  SchoolList:Array<any> = [{}];
  editFlag : boolean = true;
  editData = [];
  schholName = '';
  id:number= 0;
  constructor(
    private _dataService:UtilityServiceService,
    private _localCommunication:LocalcommunicationService,
    private router: Router
    ) { 

    }

  ngOnInit() {
      this.objectForm = new FormGroup({
      'schoolName': new FormControl(null,Validators.required),
      'schools':new FormArray([
      ])
    });
   
    if(this.router.url.includes('edit')){
      // console.log(JSON.parse(localStorage.getItem('school')).schoolName);
      this.editFlag = false;
      this.id = JSON.parse(localStorage.getItem('school')).id;
      let name = JSON.parse(localStorage.getItem('school')).schoolName;
      (<FormArray>this.objectForm.get('schools')).push(new FormControl(name));
    }else{
      (<FormArray>this.objectForm.get('schools')).push(new FormControl(null));
    }
  }

  ngAfterViewInit(){
    
  }


  addSchool(){
        this.SchoolList.push({});
        (<FormArray>this.objectForm.get('schools')).push(new FormControl(null, Validators.required));
  }


  onSubmit(){
    console.log('ng sebmit called')
    console.log(this.objectForm.value.schools)
    this._dataService.saveSchool(this.objectForm.value.schools).subscribe(res=>{
      console.log(res,'res')
    })
  }
  ngOnDestroy(){
    localStorage.clear();
  }
  onUpdate(){
    this._dataService.updateSchool(this.id,this.objectForm.value.schools).subscribe(res=>{
      this.router.navigate(['school/view'])
    })
  }

}
