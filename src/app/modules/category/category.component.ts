import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { UtilityServiceService } from 'src/app/utility-service.service';
import { MatDialog} from '@angular/material/dialog';
import { DailogComponent } from '../dailog/dailog.component';
import { NgForm } from '@angular/forms';
import { HttpClient} from '@angular/common/http';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit{

  
  displayedColumns: string[] = ['position', 'name', 'edit', 'delete'];  
  items=[];
  dataSource:MatTableDataSource<any>;
  searchInput;
  value = 'Clear me';
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('userForm', {static: true}) userForm:NgForm;

  constructor(private _utility:UtilityServiceService,public dialog: MatDialog, private http:HttpClient) { }

  ngOnInit() {
      this._utility.getProducts().subscribe(res=>{this.items=res.datalist; console.log(res.datalist)
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;
      this.onAddCategory;
    });
    
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.paginator = this.paginator;
    this.onAddCategory;
  }


  onDelete(obj:string){
    console.log(obj)
    let x = JSON.stringify(obj);
     this._utility.deleteProduct(x).subscribe((res)=>{
        this._utility.getProducts().subscribe(res=>{
          this.items=res.datalist;
          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.paginator = this.paginator;
          
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

  onAddCategory(category:string){
    this._utility.saveCategory(category).subscribe(()=>{
      this._utility.getProducts().subscribe(res=>{
        this.items=res.datalist;
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
       });
    });
    
  }

}



