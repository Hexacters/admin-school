import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { DailogComponent } from '../dailog/dailog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  objectForm:FormGroup;
  @ViewChild('myForm',{static:true}) myForm:FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['sn', 'Category','SubCategory', 'edit', 'delete'];  
  items=[];
  states: string[]=[];
  dataSource:MatTableDataSource<any>;
  selectedLevel;
  formData={
     name:'',
     category:{
       name:'',
     }
  };
  

  constructor(private _utility:UtilityServiceService,public dialog: MatDialog,private http:HttpClient) { }

  ngOnInit() {
    this._utility.getSubCategory().subscribe(res=>{this.items=res.datalist; console.log(res.datalist)
      this.dataSource = new MatTableDataSource(this.items);
      
      this.dataSource.paginator = this.paginator;});

    this._utility.getProducts().subscribe(res=>{this.states = res.datalist})
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;

      this.objectForm = new FormGroup({
        'category': new FormControl(null),
        'subCategory': new FormControl(null),
      });

     
    }
  
    // delete filter block
    onDelete(obj){
      console.log(obj)
      let x = JSON.stringify(obj);
     
       this._utility.deleteSubCategoryt(x).subscribe((res)=>{
          this._utility.getSubCategory().subscribe(res=>{
            this.items=res.datalist;
            this.dataSource = new MatTableDataSource(this.items);
            this.dataSource.paginator = this.paginator;       
          }); console.log(res);
        });
    }
   // close filter blobk
    closeFilter(val){
      val.value=null;
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;
   }
    // filter block
    applyFilter(filterValue: string){
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    // submit data block
    onSubmit(){
      this.formData.name = JSON.stringify(this.objectForm.value.category.id);
      this.formData.category.name = this.objectForm.value.subCategory;
      let x = this.formData.name;
      let y = this.formData.category.name;
      let z = JSON.stringify(this.formData);
      this._utility.savesubCategory(x,y,z).subscribe(()=>{
      this._utility.getSubCategory().subscribe(res=>{
        this.items=res.datalist;
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        });
      });
     }
}
