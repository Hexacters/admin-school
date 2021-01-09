import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilityServiceService } from '../../utility-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-subsub-category',
  templateUrl: './subsub-category.component.html',
  styleUrls: ['./subsub-category.component.scss']
})
export class SubsubCategoryComponent implements OnInit {
  objectForm:FormGroup;
  @ViewChild('myForm',{static:true}) myForm:FormGroup;
  displayedColumns: string[] = ['sn', 'category','SubCategory','Sub-subCategory', 'edit', 'delete'];  
  items=[];
  states: string[]=[];
  subCategory=[];
  dataSource:MatTableDataSource<any>;
  formData={
     name:'',
     category:{
       id:'',
     },
     subcategory:{
      id:'',
     }
  };
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _utility:UtilityServiceService,public dialog: MatDialog,private http:HttpClient) { }

  ngOnInit() {
    this._utility.getsubsubCategory().subscribe(res=>{this.items=res.datalist; console.log(res.datalist,"s2ubCa1teoru")
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.paginator = this.paginator;});
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.paginator = this.paginator;

    this._utility.getProducts().subscribe(res=>{this.states = res.datalist});
    this._utility.getSubCategory().subscribe(res=>this.subCategory = res.datalist);


    this.objectForm = new FormGroup({
      'category': new FormControl(null),
      'subCategory': new FormControl(null),
      'subsubCategory': new FormControl(null),
    });
  }
  
    onDelete(val1,val2){
        let y= JSON.stringify(val1);
        let x= JSON.stringify(val2);
        console.log('x'+":"+x, 'y'+":"+y)
        this._utility.deletesubsubCategory(x,y).subscribe((res)=>{
          this._utility.getsubsubCategory().subscribe(res=>{this.items=res.datalist; console.log(res.datalist)
            this.dataSource = new MatTableDataSource(this.items);
            this.dataSource.paginator = this.paginator;  

            this._utility.getProducts().subscribe(res=>{this.states = res.datalist});
            this._utility.getSubCategory().subscribe(res=>this.subCategory = res.datalist);
          });
          console.log(res);
        });
      }    

    closeFilter(val){
      val.value=null;
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;
   }

    applyFilter(filterValue: string){
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSubmit(){
      console.log(this.objectForm,"oooo")
      this.formData.name = this.objectForm.value.subsubCategory;
      this.formData.category.id = this.objectForm.value.category.id;
      this.formData.subcategory.id = this.objectForm.value.subCategory.id
      let x = this.formData.name;
      let y = JSON.stringify(this.formData.category.id);
      let w = JSON.stringify(this.formData.subcategory.id);
      console.log(this.formData.name)

      const params = new HttpParams().set('name',x).set('categoryId',y).set('subCategoryId',w)
      let z = JSON.stringify(this.formData);
      
      this.http.post('http://testmode.aptimyst.com/interview/public/sub-sub-category/save',params).subscribe(()=>{
      this._utility.getsubsubCategory().subscribe(res=>{this.items=res.datalist; 
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;
      
      this._utility.getProducts().subscribe(res=>{this.states = res.datalist});
      this._utility.getSubCategory().subscribe(res=>this.subCategory = res.datalist);
    });
    });
    }

}