import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-fee-type',
  templateUrl: './fee-type.component.html',
  styleUrls: ['./fee-type.component.scss']
})
export class FeeTypeComponent implements OnInit {

  objectForm: FormGroup;
  feeTypeList: Array<any> = [{}];
  constructor(private _dataService: UtilityServiceService) { }

  ngOnInit() {
    this.objectForm = new FormGroup({
      'feeTypes': new FormArray([])
    });
    (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl());

  }

  ngAfterViewInit() {

  }
  addFeeType() {
    this.feeTypeList.push({});
    (<FormArray>this.objectForm.get('feeTypes')).push(new FormControl(null, Validators.required));
  }
  onSubmit() {
    this._dataService.saveFeetype(this.objectForm.value.feeTypes).subscribe(res => {
      console.log(res, 'res')
    })
  }

}
